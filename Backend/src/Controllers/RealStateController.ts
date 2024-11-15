import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

class RealStateController {
  static async Create(req: Request, res: Response) {
    const realstate = JSON.parse(req.body.realstate);
    const amenitie = JSON.parse(req.body.amenitie);

    const files = req.files as Express.Multer.File[];
    console.log(typeof realstate);
    console.log(amenitie);
    console.log(realstate.name);
    if (!realstate || !amenitie || files.length === 0) {
      return res
        .status(400)
        .json({ message: "Proporcione la Información Requerida" });
    }

    try {
      await prisma.$transaction(async (tx) => {
        const newRealState = await tx.realState.create({
          data: {
            name: realstate.name,
            description: realstate.description,
            direction: realstate.direction,
            phone: realstate.phone,
            email: realstate.email,
            price: realstate.price,
            status: realstate.status,
            user: {
              connect: { id: realstate.user_id },
            },
            amenitie: {
              create: {
                wc: amenitie.wc,
                dimension: amenitie.dimension,
                parking: amenitie.parking,
                rooms: amenitie.rooms,
                gardens: amenitie.gardens,
              },
            },
            images: {
              create: files.map((file) => ({
                img_url: path.join("media", file.filename),
              })),
            },
          },
        });
        if (!newRealState) throw new Error("Error al crear la propiedad");
      });
      return res.status(200).json({ message: "Propiedad Creada con Éxito" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error Inesperado, Intente más tarde" });
    }
  }

  static async ListRealStates(req: Request, res: Response) {
    const realStates = await prisma.realState.findMany({
      include: { amenitie: true, images: true },
    });
    return res.json(realStates);
  }

  static async ListMyStates(req: Request, res: Response) {
    const { id } = req.params;
    const realStates = await prisma.realState.findMany({
      where: { user_id: +id },
      include: { amenitie: true, images: true },
    });
    return res.json(realStates);
  }

  static async AddImages(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Valor o Propiedad Invalida" });
    }

    const files = req.files as Express.Multer.File[];

    try {
      const realstate = await prisma.realState.findUnique({
        where: { id: parsedId },
      });
      await prisma.realStateImages.createMany({
        data: files.map((file) => ({
          real_state_id: parsedId,
          img_url: path.join("media", file.filename),
        })),
      });
      return res.status(200).json({ message: "Imágenes agregadas con éxito" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al agregar imágenes" });
    }
  }

  static async EditOnlyImages(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Valor o Propiedad Invalida" });
    }

    const files = req.files as Express.Multer.File[];
    console.log(files);
    try {
      const realstate = await prisma.realState.findUnique({
        where: { id: parsedId },
      });

      const images = await prisma.realStateImages.findMany({
        where: { real_state_id: parsedId },
      });

      images.forEach((image) =>
        fs.unlinkSync(path.join(__dirname, "../../", image.img_url))
      );

      await prisma.realStateImages.deleteMany({
        where: { real_state_id: parsedId },
      });

      await prisma.realStateImages.createMany({
        data: files.map((file) => ({
          real_state_id: parsedId,
          img_url: path.join("media", file.filename),
        })),
      });

      return res
        .status(200)
        .json({ message: "Imágenes actualizadas con éxito" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al actualizar imágenes" });
    }
  }

  static async DeleteSingleImage(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedImage = await prisma.realStateImages.delete({
        where: { id: parseInt(id) },
      });

      if (deletedImage) {
        fs.unlinkSync(path.join(__dirname, "../../", deletedImage.img_url));
      }

      return res.status(200).json({ message: "Imagen eliminada con éxito" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al eliminar imagen" });
    }
  }

  static async DeleteAllImages(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Valor o Propiedad Invalida" });
    }

    try {
      const images = await prisma.realStateImages.findMany({
        where: { real_state_id: parsedId },
      });

      images.forEach((image) =>
        fs.unlinkSync(path.join(__dirname, "../../", image.img_url))
      );

      await prisma.realStateImages.deleteMany({
        where: { real_state_id: parsedId },
      });

      return res.status(200).json({ message: "Todas las imágenes eliminadas" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error al eliminar todas las imágenes" });
    }
  }

  static async ShowImage(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const image = await prisma.realStateImages.findUnique({
        where: { id: parseInt(id) },
      });

      if (!image) {
        return res.status(404).json({ message: "Imagen no encontrada" });
      }

      const imagePath = path.join(__dirname, "../../", image.img_url);
      return res.sendFile(imagePath);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al mostrar la imagen" });
    }
  }

  static async EditStates(req: Request, res: Response) {
    const { id } = req.params;
    const { realstate, amenitie } = req.body;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Valor o Propiedad Invalida" });
    }

    const realState = await prisma.realState.findUnique({
      where: { id: parsedId },
      include: { amenitie: true },
    });
    if (!realState) {
      return res.status(404).json({ message: "Propiedad Inexistente" });
    }

    try {
      await prisma.$transaction(async (tx) => {
        if (!realstate && !amenitie) {
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
      });
      return res
        .status(200)
        .json({ message: "Propiedad Actualizada con Éxito" });
    } catch (error) {
      console.error(error);
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
      include: {
        amenitie: true,
        images: true,
        auction: {
          include: {
            bids: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
              orderBy: { amount: "desc" },
            },
          },
        },
      },
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
      include: { amenitie: true },
    });
    if (!realState) {
      return res.status(404).json({ message: "Propiedad Inexistente" });
    }

    try {
      await prisma.realState.delete({ where: { id: realState.id } });
      return res.status(200).json({ message: "Propiedad eliminada con éxito" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al eliminar propiedad" });
    }
  }
}

export default RealStateController;
