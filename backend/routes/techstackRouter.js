import {Router} from "express";
import { createTech, deleteAllTech, deleteTech, getAllTech, updateTech } from "../controllers/techstackController.js";
import { validateCreateTechInput, validateIdParam } from "../middleware/fieldValidation/techstack/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
const router = Router();

router.get("/get-all-tech", getAllTech);

// Authication and authorization
router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post("/", upload.single("imageUrl"), validateCreateTechInput, createTech);
router.patch("/update-tech/:id", upload.single("imageUrl"), validateIdParam, updateTech);
router.delete("/delete-tech/:id", validateIdParam, deleteTech);
router.delete("/delete-all-tech", deleteAllTech);

export default router
