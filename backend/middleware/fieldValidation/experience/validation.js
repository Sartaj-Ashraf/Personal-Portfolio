import { body, param } from "express-validator";
import { badRequestErr } from "../../../errors/customErors.js";
import mongoose from "mongoose";
import { withValidationErrors } from "../../../errors/withValidationErrors.js";

export const validateIdParam = withValidationErrors([
    param("id").custom(async (value) => {
        const isValidId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidId) throw new badRequestErr("invalid id");
    }),
]);

export const validateCreateExperienceInput = withValidationErrors([
    body("*.title").notEmpty().withMessage("Title is required"),
    body("*.company").notEmpty().withMessage("Company name is required"),
    body("*.location").notEmpty().withMessage("Location is required"),
    body("*.employmentType").notEmpty().withMessage("Employment type is required"),
]);


