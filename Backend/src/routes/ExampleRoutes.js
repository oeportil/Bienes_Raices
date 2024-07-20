import { Router } from "express";
import { ExampleController } from "../controllers/ExampleController.js";
const router = Router();

router.get('/', ExampleController.getSomething)

export default router;