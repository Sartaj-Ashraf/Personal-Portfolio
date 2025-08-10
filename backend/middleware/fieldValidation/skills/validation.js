import { body, param } from "express-validator";
import { badRequestErr } from "../../../errors/customErors.js";
import mongoose from "mongoose";
import { withValidationErrors } from "../../../errors/withValidationErrors.js";

export const validateIdParam = withValidationErrors([
    param("id").custom(async (value) => {
        const isValidId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidId) throw new badRequestErr("Invalid id");
    }),
]);

export const validateCreateSkillInput = withValidationErrors([
    body("title").notEmpty().withMessage("Title is required").isString().withMessage("Title must be a string"),
    body("description").notEmpty().withMessage("Description is required").isString().withMessage("Description must be a string"),
    body("category").notEmpty().withMessage("Category is required").isString().withMessage("Category must be a string"),
]);


