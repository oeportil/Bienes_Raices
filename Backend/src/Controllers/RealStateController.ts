import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RealStateController {
    static async Create(req: Request, res: Response) {
        const { realstate, amenitie, images } = req.body;

        if (!realstate || !amenitie || !images) {
            return res.status(400).json({ message: "Proporcione la Informacion Requerida" });
        }

        try {
            await prisma.$transaction(async (tx) => {
                const newRealState = await tx.realState.create({ data: { ...realstate } });
                if (!newRealState) {
                    throw new Error("Error al crear la propiedad");
                }

                const amenities = await tx.amenitie.create({ data: { ...amenitie } });
                if (!amenities) {
                    throw new Error("Error al crear las amenidades");
                }

                const newImages = await tx.realStateImages.create({ data: { ...images } });
                if (!newImages) {
                    throw new Error("Error al crear las imágenes");
                }
            });

            return res.status(200).json({ message: "Propiedad Creada con Éxito" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message || "Error Inesperado, Intente más tarde" });
            }
            return res.status(500).json({ message: "Error Inesperado, Intente más tarde" });
        }
    }

    static async ListRealStates(req: Request, res: Response) {
        const realStates = await prisma.realState.findMany({ include: { amenitie: true, images: true } });
        return res.json(realStates);
    }

    static async EditStates(req: Request, res: Response) {
        const { id } = req.params;
        const { realstate, amenitie, images } = req.body;

        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Valor o Propiedad Invalida" });
        }

        const realState = await prisma.realState.findUnique({ where: { id: parsedId }, include: { amenitie: true, images: true } });
        if (!realState) {
            return res.status(404).json({ message: "Propiedad Inexistente" });
        }

        try {
            await prisma.$transaction(async (tx) => {
                if (!realstate && !amenitie && !images) {
                    return res.status(400).json({ message: "Proporcione la Informacion Requerida" });
                }

                await tx.realState.update({ where: { id: parsedId }, data: { ...realstate } });
                await tx.amenitie.update({ where: { id: realState.amenitie.id }, data: { ...amenitie } });
                await tx.realStateImages.update({ where: { id: realState.images[0].id }, data: { ...images } });
            });

            return res.status(200).json({ message: "Propiedad Actualizada con Éxito" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message || "Error Inesperado, Intente más tarde" });
            }
            return res.status(500).json({ message: "Error Inesperado, Intente más tarde" });
        }
    }

    static async GetRealState(req: Request, res: Response) {
        const { id } = req.params;
        const parsedId = parseInt(id);
        
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Valor o Propiedad Invalida" });
        }

        const realState = await prisma.realState.findUnique({ where: { id: parsedId }, include: { amenitie: true, images: true } });
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

        const realState = await prisma.realState.findUnique({ where: { id: parsedId }, include: { amenitie: true, images: true } });
        if (!realState) {
            return res.status(404).json({ message: "Propiedad Inexistente" });
        }

        try {
            await prisma.realState.delete({ where: { id: realState.id } });
            return res.status(200).json({ message: "Propiedad Eliminada con Éxito" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message || "Error Inesperado, Intente más tarde" });
            }
            return res.status(500).json({ message: "Error Inesperado, Intente más tarde" });
        }
    }
}

export default RealStateController;
