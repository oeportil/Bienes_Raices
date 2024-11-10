import { Router } from "express";
import UserController from "../Controllers/UserController";

const router = Router();

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.patch("/:id", UserController.EditUser);

export default router;
