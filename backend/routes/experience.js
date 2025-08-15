import { Router } from "express";
import { createExperience, deleteExperience, getAllExperiences, updateExperience } from "../controllers/experienceController.js";
// import { validateCreateProfileInput } from "../middleware/fieldValidation/profile/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import { validateCreateExperienceInput, validateIdParam } from "../middleware/fieldValidation/experience/validation.js";
const router = Router();

router.get("/get-experience", getAllExperiences);
// router.get("/get-project/:id", getProjectById);

// Authication and authorization
router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post("/", validateCreateExperienceInput, upload.single("coverImage"), upload.single("companyLogo"), createExperience);
router.patch("/update-experience/:id", validateIdParam, upload.single("coverImage"), upload.single("companyLogo"), updateExperience);
router.delete("/delete-experience/:id", validateIdParam, deleteExperience);

export default router
