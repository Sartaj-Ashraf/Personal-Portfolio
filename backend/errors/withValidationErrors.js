import { validationResult } from "express-validator";
import { badRequestErr } from "./customErors.js";

export const withValidationErrors = (validateValues) => {
    return [
      validateValues,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessage = errors.array().map((err) => err.message);
          throw new badRequestErr(errorMessage);
        }
        next();
      },  
    ];
  };
