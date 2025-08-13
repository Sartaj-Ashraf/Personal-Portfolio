import { Router } from "express";
import { createProfile, deleteProfile, getProfile, updateProfile } from "../controllers/profileController.js";
// import { validateCreateProfileInput } from "../middleware/fieldValidation/profile/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-profile", getProfile);
// router.get("/get-project/:id", getProjectById);

// Authication and authorization
router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post("/", createProfile);
router.patch("/update-profile/:id",  updateProfile);
router.delete("/delete-profile/:id", deleteProfile);

export default router
