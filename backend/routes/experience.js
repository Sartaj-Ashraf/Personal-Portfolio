import { Router } from "express";
import { createExperience, deleteExperience, getAllExperiences } from "../controllers/experienceController.js";
// import { validateCreateProfileInput } from "../middleware/fieldValidation/profile/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-experience", getAllExperiences);
// router.get("/get-project/:id", getProjectById);

// Authication and authorization
router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post("/", createExperience);
// router.patch("/update-experience/:id",  updateExperience);
router.delete("/delete-experience/:id", deleteExperience);

export default router
