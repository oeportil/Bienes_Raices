import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { subDays, isAfter, isBefore } from "date-fns";

const prisma = new PrismaClient();

class AuctionController {
  // Iniciar una nueva subasta
  static async startAuction(req: Request, res: Response) {
    const { realStateId, startingPrice, startDate, endDate } = req.body;

    try {
      const newAuction = await prisma.auction.create({
        data: {
          startingPrice: +startingPrice,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          realState: { connect: { id: +realStateId } },
        },
      });
      const editas = await prisma.realState.update({
        where: {
          id: +realStateId,
        },
        data: {
          status: "SUBASTA",
        },
      });

      return res.status(201).json({
        message: "Subasta iniciada con éxito",
        auction: newAuction,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error al iniciar la subasta", error });
    }
  }

  // Editar fecha de la subasta (solo si falta más de 3 días para el inicio)
  static async editAuctionDate(req: Request, res: Response) {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    try {
      const auction = await prisma.auction.findUnique({
        where: { id: parseInt(id) },
      });

      if (!auction) {
        return res.status(404).json({ message: "Subasta no encontrada" });
      }

      const threeDaysBeforeStart = subDays(auction.startDate, 3);

      if (isAfter(new Date(), threeDaysBeforeStart)) {
        return res.status(400).json({
          message: "Solo se puede editar con más de 3 días de anticipación",
        });
      }

      const updatedAuction = await prisma.auction.update({
        where: { id: parseInt(id) },
        data: { startDate: new Date(startDate), endDate: new Date(endDate) },
      });

      return res.status(200).json({
        message: "Fecha de la subasta actualizada con éxito",
        auction: updatedAuction,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error al actualizar la fecha de la subasta" });
    }
  }

  // Hacer una puja
  static async placeBid(req: Request, res: Response) {
    const { auctionId, userId, amount } = req.body;

    try {
      const auction = await prisma.auction.findUnique({
        where: { id: +auctionId },
        include: { bids: true },
      });

      if (!auction) {
        return res.status(404).json({ message: "Subasta no encontrada" });
      }

      const currentTime = new Date();

      if (
        isBefore(currentTime, auction.startDate) ||
        isAfter(currentTime, auction.endDate)
      ) {
        return res.status(400).json({
          message: "La puja debe realizarse dentro del período de la subasta",
        });
      }

      const maxBid = await prisma.bid.findFirst({
        where: { id: +auctionId },
        orderBy: { amount: "desc" },
      });

      if (maxBid && amount.lte(maxBid.amount)) {
        return res.status(400).json({
          message: "La puja debe ser mayor que la puja máxima actual",
        });
      }

      const userBids = await prisma.bid.findMany({
        where: { id: +auctionId, user_id: +userId },
        orderBy: { timestamp: "desc" },
        take: 3,
      });

      await prisma.$transaction(async (tx) => {
        if (userBids.length >= 3) {
          await tx.bid.delete({
            where: { id: userBids[userBids.length - 1].id },
          });
        }

        await tx.bid.create({
          data: {
            amount: +amount,
            user: { connect: { id: +userId } },
            auction: { connect: { id: +auctionId } },
          },
        });
      });

      return res.status(201).json({ message: "Puja realizada con éxito" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al realizar la puja" });
    }
  }
  static async getRealStateWithoutAuctions(req: Request, res: Response) {
    const { id } = req.params;
    const realStates = await prisma.realState.findMany({
      where: { user_id: +id, auction: null },
      include: { amenitie: true, images: true },
    });
    return res.json(realStates);
  }

  // Mostrar detalles de todas las subastas del usuario y las 10 mejores pujas (excluyendo duplicadas de un mismo usuario)
  static async getMyAuctions(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const auction = await prisma.auction.findMany({
        where: { realState: { user_id: parseInt(id) } },
        include: {
          realState: { include: { images: true } },
          bids: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { amount: "desc" },
          },
        },
      });

      if (!auction) {
        return res.status(404).json({ message: "Datos no encontrados" });
      }

      auction.map((subasta) => {
        const uniqueBids: { [user_id: number]: boolean } = {};
        const top10Bids = subasta.bids
          .filter((bid) => {
            if (!uniqueBids[bid.user_id]) {
              uniqueBids[bid.user_id] = true;
              return true;
            }
            return false;
          })
          .slice(0, 10);
        subasta.bids = top10Bids;
      });

      return res.status(200).json(auction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al obtener los detalles de la subasta",
      });
    }
  }

  // Mostrar detalles de todas las subastas del usuario que ha pujado y las 10 mejores pujas (excluyendo duplicadas de un mismo usuario)
  static async getMyAuctionBids(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const auction = await prisma.auction.findMany({
        where: { bids: { some: { user_id: parseInt(id) } } },
        include: {
          realState: { include: { images: true } },
          bids: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { amount: "desc" },
          },
        },
      });

      if (!auction) {
        return res.status(404).json({ message: "Datos no encontrados" });
      }

      auction.map((subasta) => {
        const uniqueBids: { [user_id: number]: boolean } = {};
        const top10Bids = subasta.bids
          .filter((bid) => {
            if (!uniqueBids[bid.user_id]) {
              uniqueBids[bid.user_id] = true;
              return true;
            }
            return false;
          })
          .slice(0, 10);
        subasta.bids = top10Bids;
      });

      return res.status(200).json(auction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al obtener los detalles de la subasta",
      });
    }
  }

  // Mostrar detalles de todas las subastas y las 10 mejores pujas (excluyendo duplicadas de un mismo usuario)
  static async getAuctions(req: Request, res: Response) {
    try {
      const auction = await prisma.auction.findMany({
        include: {
          realState: { include: { images: true } },
          bids: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { amount: "desc" },
          },
        },
      });

      if (!auction) {
        return res.status(404).json({ message: "Datos no encontrados" });
      }

      auction.map((subasta) => {
        const uniqueBids: { [user_id: number]: boolean } = {};
        const top10Bids = subasta.bids
          .filter((bid) => {
            if (!uniqueBids[bid.user_id]) {
              uniqueBids[bid.user_id] = true;
              return true;
            }
            return false;
          })
          .slice(0, 10);
        subasta.bids = top10Bids;
      });

      return res.status(200).json(auction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al obtener los detalles de la subasta",
      });
    }
  }

  // Mostrar detalles de la subasta y las 10 mejores pujas (excluyendo duplicadas de un mismo usuario)
  static async getAuctionDetails(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const auction = await prisma.auction.findUnique({
        where: { id: parseInt(id) },
        include: {
          realState: true,
          bids: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { amount: "desc" },
          },
        },
      });

      if (!auction) {
        return res.status(404).json({ message: "Subasta no encontrada" });
      }

      const uniqueBids: { [user_id: number]: boolean } = {};
      const top10Bids = auction.bids
        .filter((bid) => {
          if (!uniqueBids[bid.user_id]) {
            uniqueBids[bid.user_id] = true;
            return true;
          }
          return false;
        })
        .slice(0, 10);

      return res.status(200).json({
        auction: {
          realState: auction.realState,
          details: auction,
          topBids: top10Bids,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al obtener los detalles de la subasta",
      });
    }
  }
  static async getTop10Bids(req: Request, res: Response) {
    const { id } = req.params;

    try {
      // Obtener las pujas de la subasta, ordenadas de mayor a menor
      const bids = await prisma.bid.findMany({
        where: { id: parseInt(id) },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { amount: "desc" },
      });

      if (!bids.length) {
        return res
          .status(404)
          .json({ message: "No se encontraron pujas para esta subasta" });
      }

      // Filtrar para obtener solo una puja por usuario
      const uniqueBids: { [user_id: number]: boolean } = {};
      const top10Bids = bids
        .filter((bid) => {
          if (!uniqueBids[bid.user_id]) {
            uniqueBids[bid.user_id] = true;
            return true;
          }
          return false;
        })
        .slice(0, 10);

      return res.status(200).json({
        message: "Top 10 pujas de usuarios distintos",
        topBids: top10Bids,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al obtener las mejores pujas",
      });
    }
  }
}

export default AuctionController;
