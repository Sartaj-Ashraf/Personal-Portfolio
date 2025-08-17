import { Router } from "express";
import { createProfile, deleteProfile, getProfile, getProfileById, updateProfile } from "../controllers/profileController.js";
import { validateCreateProfileInput, validateIdParam } from "../middleware/fieldValidation/profile/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";
const router = Router();

router.get("/get-profile", getProfile);
router.get("/get-profile-by-id/:id", validateIdParam, getProfileById);

// Authication and authorization
router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post("/",upload.single("imageUrl"),  createProfile);
router.patch("/update-profile/:id",upload.single("imageUrl"), validateIdParam, updateProfile);
router.delete("/delete-profile/:id", validateIdParam, deleteProfile);

export default router
