import { Router } from "express";
import { registerUser, loginUser, logout } from "../controllers/userController.js";
import { validateRegisterInput, validateLoginInput } from "../middleware/fieldValidation/auth/validation.js";

const router = Router();

router.post("/register-user", validateRegisterInput, registerUser);
router.post("/login-user", validateLoginInput, loginUser);
router.post("/logout", logout);

export default router;