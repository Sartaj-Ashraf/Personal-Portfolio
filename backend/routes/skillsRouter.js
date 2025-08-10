import { Router } from "express"
import { createSkill, deleteAllSkills, deleteSkill, getAllSkills, updateSkills } from "../controllers/skillsController.js";
import { validateIdParam, validateCreateSkillInput, validateUpdateSkillInput } from "../middleware/fieldValidation/skills/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
const router = Router()

router.get("/get-all-skills", getAllSkills);

// Authication and authorization
router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.post("/", upload.single("imageUrl"), validateCreateSkillInput, createSkill);
router.patch("/update-skill/:id", upload.single("imageUrl"), validateIdParam, validateUpdateSkillInput, updateSkills);
router.delete("/delete-skill/:id", validateIdParam, deleteSkill);
router.delete("/delete-all-skills", deleteAllSkills);

export default router
