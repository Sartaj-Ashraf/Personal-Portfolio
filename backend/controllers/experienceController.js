import Experience from "../models/experienceModel.js";
import Techstack from "../models/techstackModel.js"; // Import Techstack model

import { StatusCodes } from "http-status-codes";
import { badRequestErr, NotFoundErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";
import { formatImage } from "../utils/multer.js";


export const createExperience = async (req, res) => {
    const { technologiesUsed } = req.body;
    let parsedTechnologiesUsed = technologiesUsed;
    let details = { ...req.body };
    if (typeof technologiesUsed === 'string') {
        try {
            parsedTechnologiesUsed = JSON.parse(technologiesUsed);
        } catch (error) {
            throw new badRequestErr("Invalid techStack format");
        }
    }
    if (req.file) {
        const coverImageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(coverImageUrl);
        details.coverImage = imageResponse.secure_url;
        details.coverImagePublicId = imageResponse.public_id;
    }
    if (req.file) {
        const companyLogoUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(companyLogoUrl);
        details.companyLogo = imageResponse.secure_url;
        details.companyLogoPublicId = imageResponse.public_id;
    }
    details.technologiesUsed = parsedTechnologiesUsed;
    const experience = await Experience.create(details);
    res.status(StatusCodes.CREATED).json({ success: true, message: "Experience created successfully", experience });
}

export const getAllExperiences = async (req, res) => {
    const experiences = await Experience.find().populate("technologiesUsed");
    res.status(StatusCodes.OK).json({ success: true, message: "Experiences fetched successfully", experiences });
}

export const updateExperience = async (req, res) => {
    const { id } = req.params;
    let experience = await Experience.findById(id);
    if (!experience) {
        throw new NotFoundErr("Experience not found");
    }
    const { technologiesUsed } = req.body;
    let parsedTechnologiesUsed = technologiesUsed;
    let fieldToUpdate = { ...req.body };
    if (typeof technologiesUsed === 'string') {
        try {
            parsedTechnologiesUsed = JSON.parse(technologiesUsed);
            fieldToUpdate.technologiesUsed = parsedTechnologiesUsed;
        } catch (error) {
            throw new badRequestErr("Invalid techStack format");
        }
    }
    if (experience.coverImagePublicId) {
        await cloudinary.v2.uploader.destroy(experience.coverImagePublicId);
    }
    if (experience.companyLogoPublicId) {
        await cloudinary.v2.uploader.destroy(experience.companyLogoPublicId);
    }
    if (req.file) {
        const coverImageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(coverImageUrl);
        fieldToUpdate.coverImage = imageResponse.secure_url;
        fieldToUpdate.coverImagePublicId = imageResponse.public_id;
    }
    if (req.file) {
        const companyLogoUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(companyLogoUrl);
        fieldToUpdate.companyLogo = imageResponse.secure_url;
        fieldToUpdate.companyLogoPublicId = imageResponse.public_id;
    }

    experience = await Experience.findByIdAndUpdate(id, fieldToUpdate, { new: true });
    res.status(StatusCodes.OK).json({ success: true, message: "Experience updated successfully", experience });
}

export const deleteExperience = async (req, res) => {
    const { id } = req.params;
    let experience = await Experience.findById(id);
    if (!experience) {
        throw new NotFoundErr("Experience not found");
    }
    if (experience.coverImagePublicId) {
        await cloudinary.v2.uploader.destroy(experience.coverImagePublicId);
    }
    if (experience.companyLogoPublicId) {
        await cloudinary.v2.uploader.destroy(experience.companyLogoPublicId);
    }
    experience = await Experience.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({ success: true, message: "Experience deleted successfully", experience });
}