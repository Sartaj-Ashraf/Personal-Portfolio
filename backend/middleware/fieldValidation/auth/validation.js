import { body, param } from "express-validator";
import { badRequestErr } from "../../../errors/customErors.js";
import mongoose from "mongoose";
import User from "../../../models/userModel.js";
import { withValidationErrors } from "../../../errors/withValidationErrors.js";

export const validateIdParam = withValidationErrors([
    param("id").custom(async (value) => {
        const isValidId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidId) throw new badRequestErr("invalid id");
    }),
]);

export const validateRegisterInput = withValidationErrors([
    body("username").notEmpty().withMessage("Username is required"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) throw new badRequestErr("email already exist");
        }),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be atleast 8 characters"),
]);

export const validateLoginInput = withValidationErrors([
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
]);

export const validateSkillInput = withValidationErrors([
    body("skillName").notEmpty().withMessage("Skill name is required"),
    body("description")
        .notEmpty()
        .withMessage("Description is required"),
]);

// Validate project input
export const validateProjectInput = withValidationErrors([
    body('projectName')
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ max: 100 })
        .withMessage('Project name cannot exceed 100 characters'),
    body('description')
        .notEmpty()
        .withMessage('Project description is required'),
    body('projectUrl')
        .optional()
        .isURL()
        .withMessage('Please provide a valid URL'),
    body('skillsRelated')
        .optional()
        .custom((value) => {
            // Value could be an array or comma-separated string
            if (Array.isArray(value)) {
                return true;
            } else if (typeof value === 'string') {
                // If string, we'll handle it in the controller by splitting it
                return true;
            }
            throw new Error('Skills must be provided as array or comma-separated string');
        }),
    body('techStack')
        .optional()
        .custom((value) => {
            // Value could be an array or comma-separated string
            if (Array.isArray(value)) {
                return true;
            } else if (typeof value === 'string') {
                // If string, we'll handle it in the controller by splitting it
                return true;
            }
            throw new Error('Tech stack must be provided as array or comma-separated string');
        }),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            if (!value || !req.body.startDate) return true;

            const startDate = new Date(req.body.startDate);
            const endDate = new Date(value);

            if (endDate < startDate) {
                throw new Error('End date cannot be before start date');
            }
            return true;
        }),
]);
