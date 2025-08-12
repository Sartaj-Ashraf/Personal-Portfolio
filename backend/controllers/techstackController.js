import Techstack from "../models/techstackModel.js";
import { StatusCodes } from "http-status-codes";
import { formatImage } from "../utils/multer.js";
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";
import cloudinary from "cloudinary";

export const createTech = async (req, res) => {
    const { title, } = req.body;
    const existingTechStack = await Techstack.findOne({ title: { $regex: new RegExp(`^${title}$`, "i") } });
    if (existingTechStack) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Techstack already exists" });
    }

    const newTechStack = { ...req.body };
    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        newTechStack.imageUrl = imageResponse.secure_url;
        newTechStack.imagePublicId = imageResponse.public_id;
    }
    const techStack = await Techstack.create(newTechStack);
    res.status(StatusCodes.CREATED).json({ success: true, message: "Techstack created successfully", techStack });
}

export const getAllTech = async (req, res) => {
    const { search, category, proficiencyLevel, featured } = req.query;
    const queryObject = {};
    if (search) {
        queryObject.$or = [
            { title: { $regex: search, $options: "i" } },
        ]
    }
    if (category) {
        queryObject.category = category;
    }
    if (proficiencyLevel) {
        queryObject.proficiencyLevel = proficiencyLevel;
    }
    if (featured) {
        queryObject.featured = featured;
    }
    if (req.query.page || req.query.limit) {
        const { page, limit, skip } = getPaginationParams(req);
        const techStacks = await Techstack.find(queryObject).skip(skip).limit(limit);
        const totalDocs = await Techstack.countDocuments(queryObject);
        const paginationInfo = getPaginationInfo(totalDocs, page, limit);
        return res.status(StatusCodes.OK).json({ success: true, message: "Techstacks fetched successfully", techStacks, paginationInfo });
    }
    const techStacks = await Techstack.find(queryObject);
    res.status(StatusCodes.OK).json({ success: true, message: "Techstacks fetched successfully", techStacks });
}

export const updateTech = async (req, res) => {
    const { id } = req.params;
    const existingTechStack = await Techstack.findById(id);
    if (!existingTechStack) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Techstack not found" });
    }
    const newTechStack = { ...req.body };
    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        newTechStack.imageUrl = imageResponse.secure_url;
        newTechStack.imagePublicId = imageResponse.public_id;
    }
    if (existingTechStack.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingTechStack.imagePublicId);
    }
    const updatedTechStack = await Techstack.findByIdAndUpdate(id, newTechStack, { new: true });
    res.status(StatusCodes.OK).json({ success: true, message: "Techstack updated successfully", updatedTechStack });
}

export const deleteTech = async (req, res) => {
    const { id } = req.params;
    const techStack = await Techstack.findByIdAndDelete(id);
    if (!techStack) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Techstack not found" });
    }
    if (techStack.imagePublicId) {
        await cloudinary.v2.uploader.destroy(techStack.imagePublicId);
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Techstack deleted successfully", techStack });
}

export const deleteAllTech = async (req, res) => {
    const techStacks = await Techstack.deleteMany();
    if (techStacks.deletedCount === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "No techstacks found" });
    }
    techStacks.forEach(techStack => {
        if (techStack.imagePublicId) {
            cloudinary.v2.uploader.destroy(techStack.imagePublicId);
        }
    });
    res.status(StatusCodes.OK).json({ success: true, message: "All techstacks deleted successfully", techStacks });
}