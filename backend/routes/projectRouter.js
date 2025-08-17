import {Router} from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "../controllers/projectController.js";
import { validateIdParam } from "../middleware/fieldValidation/project/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/get-all-projects", getAllProjects);
router.get("/get-project-by-id/:id", validateIdParam, getProjectById);

// Authication and authorization
router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post("/", upload.array('projectImages', 10), createProject);

router.patch("/update-project/:id", validateIdParam, upload.array('projectImages', 10), updateProject);
router.delete("/delete-project/:id", validateIdParam, deleteProject);

export default router;