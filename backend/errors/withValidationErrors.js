import { validationResult } from "express-validator";
import { badRequestErr } from "./customErors.js";

export const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((err) => err.msg);
                throw new badRequestErr(errorMessages);
            }
            next();
        },
    ];
};
