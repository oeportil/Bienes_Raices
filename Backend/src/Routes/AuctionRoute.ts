import { Router } from "express";
import AuctionController from "../Controllers/AuctionController";

const router = Router();

router.post("/", AuctionController.startAuction);
router.post("/puja", AuctionController.placeBid);
router.patch("/:id", AuctionController.editAuctionDate);
router.get("/", AuctionController.getAuctions);
router.get("/user/:id", AuctionController.getMyAuctions);
router.get("/mypuja/:id", AuctionController.getMyAuctionBids);
router.get("/:id", AuctionController.getAuctionDetails);
router.get("/puja/:id", AuctionController.getTop10Bids);
router.get("/realstate/:id", AuctionController.getRealStateWithoutAuctions);

export default router;
