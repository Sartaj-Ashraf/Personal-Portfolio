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

export const validateContactQueryInput = withValidationErrors([
    body("*.name").notEmpty().withMessage("Name is required"),
    body("*.phone_number").notEmpty().withMessage("Phone number is required"),
    body("*.message").notEmpty().withMessage("Message is required"),
]);


