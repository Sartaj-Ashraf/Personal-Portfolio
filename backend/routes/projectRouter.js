import {Router} from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "../controllers/projectController.js";
import { validateCreateProjectInput, validateIdParam } from "../middleware/fieldValidation/project/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-all-projects", getAllProjects);
router.get("/get-project/:id", getProjectById);

// Authication and authorization
router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post("/", validateCreateProjectInput, createProject);
router.patch("/update-project/:id", validateIdParam, updateProject);
router.delete("/delete-project/:id", validateIdParam, deleteProject);

export default router;