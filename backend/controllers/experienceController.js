import Experience from "../models/experienceModel.js";
import { StatusCodes } from "http-status-codes";
import { badRequestErr, NotFoundErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";
import { formatImage } from "../utils/multer.js";

// Helper: Parse technologiesUsed (string → JSON)
const parseTechStack = (techData) => {
    if (typeof techData === "string") {
        try {
            return JSON.parse(techData);
        } catch (error) {
            throw new badRequestErr("Invalid techStack format");
        }
    }
    return techData;
};

// Helper: Upload image to Cloudinary
const uploadImage = async (file) => {
    const imageUrl = formatImage(file);
    const response = await cloudinary.v2.uploader.upload(imageUrl);
    return { url: response.secure_url, publicId: response.public_id };
};


 // Helper: Delete image from Cloudinary

const deleteImage = async (publicId) => {
    if (publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
    }
};


// Create Experience
export const createExperience = async (req, res) => {
    const details = { ...req.body };
    details.technologiesUsed = parseTechStack(details.technologiesUsed);

    if (req.files) {
        if (req.files.coverImage?.[0]) {
            const cover = await uploadImage(req.files.coverImage[0]);
            details.coverImage = cover.url;
            details.coverImagePublicId = cover.publicId;
        }
        if (req.files.companyLogo?.[0]) {
            const logo = await uploadImage(req.files.companyLogo[0]);
            details.companyLogo = logo.url;
            details.companyLogoPublicId = logo.publicId;
        }
    }

    const experience = await Experience.create(details);
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Experience created successfully",
        experience,
    });
};

// Get All Experiences
export const getAllExperiences = async (req, res) => {
    const experiences = await Experience.find().populate("technologiesUsed");
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Experiences fetched successfully",
        experiences,
    });
};

// Update Experience
export const updateExperience = async (req, res) => {
    const { id } = req.params;
    let experience = await Experience.findById(id);
    if (!experience) throw new NotFoundErr("Experience not found");

    const fieldToUpdate = { ...req.body };
    fieldToUpdate.technologiesUsed = parseTechStack(fieldToUpdate.technologiesUsed);

    // Delete old images if new ones are uploaded
    if (req.files) {
        if (req.files.coverImage?.[0]) {
            await deleteImage(experience.coverImagePublicId);
            const cover = await uploadImage(req.files.coverImage[0]);
            fieldToUpdate.coverImage = cover.url;
            fieldToUpdate.coverImagePublicId = cover.publicId;
        }
        if (req.files.companyLogo?.[0]) {
            await deleteImage(experience.companyLogoPublicId);
            const logo = await uploadImage(req.files.companyLogo[0]);
            fieldToUpdate.companyLogo = logo.url;
            fieldToUpdate.companyLogoPublicId = logo.publicId;
        }
    }

    experience = await Experience.findByIdAndUpdate(id, fieldToUpdate, { new: true });
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Experience updated successfully",
        experience,
    });
};

// Delete Experience
export const deleteExperience = async (req, res) => {
    const { id } = req.params;
    let experience = await Experience.findById(id);
    if (!experience) throw new NotFoundErr("Experience not found");

    await deleteImage(experience.coverImagePublicId);
    await deleteImage(experience.companyLogoPublicId);

    await Experience.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Experience deleted successfully",
        experience,
    });
};
