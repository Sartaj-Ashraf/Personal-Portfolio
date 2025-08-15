import { Router } from "express";
import { createContactQuery, deleteAllContactQueries, deleteContactQuery, getContactQueries, getRecentThreeContactQueries, updateContactQuery } from "../controllers/contactQueryController.js";
import { validateIdParam, validateContactQueryInput } from "../middleware/fieldValidation/contactquery/validation.js";
import { authenticateUser, authorizePermissions } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/",validateContactQueryInput, createContactQuery);
router.get("/get-all-contact-queries", getContactQueries);
router.get("/get-recent-contact-queries", getRecentThreeContactQueries);


router.use(authenticateUser)
router.use(authorizePermissions("admin"))

router.patch("/update-contact-query/:id", validateIdParam, updateContactQuery);
router.delete("/delete-contact-query/:id", validateIdParam, deleteContactQuery);
router.delete("/delete-all-contact-queries", deleteAllContactQueries);

export default router;
