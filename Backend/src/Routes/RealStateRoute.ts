import { Router } from "express";
import RealStateController from "../Controllers/RealStateController";

const router = Router()

router.post('/', RealStateController.Create);
router.get('/', RealStateController.ListRealStates);
router.get('/:id', RealStateController.GetRealState);
router.patch('/:id', RealStateController.EditStates);
router.delete('/:id', RealStateController.DeleteRealState);

export default router