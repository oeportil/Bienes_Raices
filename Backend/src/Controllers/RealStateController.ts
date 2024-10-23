import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { realstate, user } = req.body;
    const folderName = `${realstate.name}_${user.name}`;
    const uploadPath = path.join(__dirname, "../../media", folderName);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

class RealStateController {
  static async Create(req: Request, res: Response) {
    // Utilizamos upload.single si es una sola imagen, o upload.array para varias
    upload.array("images", 10)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: "Error en la carga de imágenes" });
      } else if (err) {
        return res
          .status(500)
          .json({ message: "Error inesperado al subir imágenes" });
      }

      const { realstate, amenitie, user } = req.body;

      if (!realstate || !amenitie || !user) {
        return res
          .status(400)
          .json({ message: "Proporcione la información requerida" });
      }

      try {
        await prisma.$transaction(async (tx) => {
          // Crear la amenidad
          const newAmenitie = await tx.amenitie.create({
            data: { ...amenitie },
          });

          // Crear la propiedad (RealState)
          const newRealState = await tx.realState.create({
            data: {
              name: realstate.name,
              description: realstate.description,
              direction: realstate.direction,
              phone: realstate.phone,
              email: realstate.email,
              price: realstate.price,
              status: realstate.status,
              user_id: user.id,
              amenitieId: newAmenitie.id,
            },
          });

          // Manejar las imágenes subidas
          const images = req.files as Express.Multer.File[];
          if (images && images.length > 0) {
            for (const img of images) {
              await tx.realStateImages.create({
                data: {
                  img_url: img.filename, // Guardar solo el nombre del archivo
                  realState: { connect: { id: newRealState.id } },
                },
              });
            }
          }
        });

        return res.status(200).json({ message: "Propiedad creada con éxito" });
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({
            message: error.message || "Error inesperado, intente más tarde",
          });
        }
        return res
          .status(500)
          .json({ message: "Error inesperado, intente más tarde" });
      }
    });
  }

  static async ListRealStates(req: Request, res: Response) {
    const realStates = await prisma.realState.findMany({
      include: { amenitie: true, images: true },
    });
    return res.json(realStates);
  }

  static async EditStates(req: Request, res: Response) {
    const { id } = req.params;
    const { realstate, amenitie, images } = req.body;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Valor o Propiedad Invalida" });
    }

    const realState = await prisma.realState.findUnique({
      where: { id: parsedId },
      include: { amenitie: true, images: true },
    });
    if (!realState) {
      return res.status(404).json({ message: "Propiedad Inexistente" });
    }

    try {
      await prisma.$transaction(async (tx) => {
        if (!realstate && !amenitie && !images) {
          return res
            .status(400)
            .json({ message: "Proporcione la Informacion Requerida" });
        }

        await tx.realState.update({
          where: { id: parsedId },
          data: { ...realstate },
        });
        await tx.amenitie.update({
          where: { id: realState.amenitie.id },
          data: { ...amenitie },
        });
        await tx.realStateImages.update({
          where: { id: realState.images[0].id },
          data: { ...images },
        });
      });

      return res
        .status(200)
        .json({ message: "Propiedad Actualizada con Éxito" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message || "Error Inesperado, Intente más tarde",
        });
      }
      return res
        .status(500)
        .json({ message: "Error Inesperado, Intente más tarde" });
    }
  }

  static async GetRealState(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Valor o Propiedad Invalida" });
    }

    const realState = await prisma.realState.findUnique({
      where: { id: parsedId },
      include: { amenitie: true, images: true },
    });
    if (!realState) {
      return res.status(404).json({ message: "Propiedad Inexistente" });
    }
    return res.json(realState);
  }

  static async DeleteRealState(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Valor o Propiedad Invalida" });
    }

    const realState = await prisma.realState.findUnique({
      where: { id: parsedId },
      include: { amenitie: true, images: true },
    });
    if (!realState) {
      return res.status(404).json({ message: "Propiedad Inexistente" });
    }

    try {
      await prisma.realState.delete({ where: { id: realState.id } });
      return res.status(200).json({ message: "Propiedad Eliminada con Éxito" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message || "Error Inesperado, Intente más tarde",
        });
      }
      return res
        .status(500)
        .json({ message: "Error Inesperado, Intente más tarde" });
    }
  }
}

export default RealStateController;
