import { Router } from "express";
import { createContactQuery, deleteAllContactQueries, deleteContactQuery, getContactQueries, updateContactQuery } from "../controllers/contactQueryController.js";
import { validateIdParam, validateUpdateContactQueryInput, validateContactQueryInput } from "../middleware/fieldValidation/contactquery/validation.js";

const router = Router();

router.post("/",validateContactQueryInput, createContactQuery);
router.get("/get-all-contact-queries", getContactQueries);
router.patch("/update-contact-query/:id", validateIdParam, validateUpdateContactQueryInput, updateContactQuery);
router.delete("/delete-contact-query/:id", validateIdParam, deleteContactQuery);
router.delete("/delete-all-contact-queries", deleteAllContactQueries);

export default router;
