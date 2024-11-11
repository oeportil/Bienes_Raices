import { Router } from "express";
import RealStateController from "../Controllers/RealStateController";

const router = Router();

router.post("/", RealStateController.Create);
router.post("/img/:id", RealStateController.AddImages);
router.get("/", RealStateController.ListRealStates);
router.get("/:id", RealStateController.GetRealState);
router.get("/img/:id", RealStateController.ShowImage);
router.patch("/:id", RealStateController.EditStates);
router.patch("/img/:id", RealStateController.EditOnlyImages);
router.delete("/:id", RealStateController.DeleteRealState);
router.delete("/img/:id", RealStateController.DeleteSingleImage);
router.delete("/img/all/:id", RealStateController.DeleteAllImages);
export default router;
