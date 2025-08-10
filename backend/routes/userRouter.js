import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);

export default router;