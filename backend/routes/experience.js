import { Router } from "express";
import {
    createExperience,
    deleteExperience,
    getAllExperiences,
    updateExperience
} from "../controllers/experienceController.js";
import {
    authenticateUser,
    authorizePermissions
} from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import {
    validateCreateExperienceInput,
    validateIdParam
} from "../middleware/fieldValidation/experience/validation.js";

const router = Router();

// Public route
router.get("/get-experience", getAllExperiences);

// Authentication & Authorization for the below routes
router.use(authenticateUser);
router.use(authorizePermissions("admin"));

// Multer fields config for both images
const experienceUploads = upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 }
]);

router.post("/", validateCreateExperienceInput, experienceUploads, createExperience);
router.patch("/update-experience/:id", validateIdParam, experienceUploads, updateExperience);
router.delete("/delete-experience/:id", validateIdParam, deleteExperience);

export default router;
