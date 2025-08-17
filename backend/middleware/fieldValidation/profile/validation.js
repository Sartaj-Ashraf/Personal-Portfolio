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

export const validateCreateProfileInput = withValidationErrors([
    body("*.email").isEmail().withMessage("Email is required"),
    body("*.name").notEmpty().withMessage("Name is required"),
    body("*.about").notEmpty().withMessage("About is required"),
]);

