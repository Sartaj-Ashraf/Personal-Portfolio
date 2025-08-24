import Techstack from "../models/techstackModel.js";
import { StatusCodes } from "http-status-codes";
import { formatImage } from "../utils/multer.js";
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";
import cloudinary from "cloudinary";
import { badRequestErr, NotFoundErr } from "../errors/customErors.js";

// @desc    Create a new techstack
// @route   POST /api/techstack
// @access  Private
export const createTech = async (req, res) => {
    const { title, keypoints, referenceWebsite } = req.body;
    const existingTechStack = await Techstack.findOne({ title: { $regex: new RegExp(`^${title}$`, "i") } });
    if (existingTechStack) {
        throw new badRequestErr("Techstack already exists");
    }
    let parsedKeyPoints = [];
    let parsedReferenceWebsite = [];
    if (typeof keypoints === 'string') {
        try {
            parsedKeyPoints = JSON.parse(keypoints);
        } catch (error) {
            throw new badRequestErr("Invalid keypoints format");
        }
    }
    if (typeof referenceWebsite === 'string') {
        try {
            parsedReferenceWebsite = JSON.parse(referenceWebsite);
        } catch (error) {
            throw new badRequestErr("Invalid reference website format");
        }
    }

    const newTechStack = { ...req.body };
    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        newTechStack.imageUrl = imageResponse.secure_url;
        newTechStack.imagePublicId = imageResponse.public_id;
    }
    newTechStack.keypoints = parsedKeyPoints;
    newTechStack.referenceWebsite = parsedReferenceWebsite;
    const techStack = await Techstack.create(newTechStack);
    res.status(StatusCodes.CREATED).json({ success: true, message: "Techstack created successfully", techStack });
}

// @desc    Get all techstacks
// @route   GET /api/techstack
// @access  Private
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
        const techStacks = await Techstack.find(queryObject).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalDocs = await Techstack.countDocuments(queryObject);
        const paginationInfo = getPaginationInfo(totalDocs, page, limit);
        return res.status(StatusCodes.OK).json({ success: true, message: "Techstacks fetched successfully", techStacks, paginationInfo });
    }
    const techStacks = await Techstack.find(queryObject).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ success: true, message: "Techstacks fetched successfully", techStacks });
}

// @desc    Get a techstack by id
// @route   GET /api/techstack/:id
// @access  Private
export const getTechById = async (req, res) => {
    const { id } = req.params;
    const techStack = await Techstack.findById(id);
    if (!techStack) {
        throw new NotFoundErr("Techstack not found");
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Techstack fetched successfully", techStack });
}

// @desc    Update a techstack
// @route   PATCH /api/techstack/:id
// @access  Private
export const updateTech = async (req, res) => {
    const { id } = req.params;
    const { keypoints, referenceWebsite } = req.body;
    let parsedKeyPoints = [];
    let parsedReferenceWebsite = [];

    if (typeof keypoints === 'string') {
        try {
            parsedKeyPoints = JSON.parse(keypoints);
        } catch (error) {
            throw new badRequestErr("Invalid keypoints format");
        }
    }
    if (typeof referenceWebsite === 'string') {
        try {
            parsedReferenceWebsite = JSON.parse(referenceWebsite);
        } catch (error) {
            throw new badRequestErr("Invalid reference website format");
        }
    }
    const existingTechStack = await Techstack.findById(id);
    if (!existingTechStack) {
        throw new NotFoundErr("Techstack not found");
    }
    const newTechStack = { ...req.body };
    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        newTechStack.imageUrl = imageResponse.secure_url;
        newTechStack.imagePublicId = imageResponse.public_id;
    }
    newTechStack.keypoints = parsedKeyPoints;
    newTechStack.referenceWebsite = parsedReferenceWebsite;

    if (existingTechStack.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingTechStack.imagePublicId);
    }
    const updatedTechStack = await Techstack.findByIdAndUpdate(id, newTechStack, { new: true });
    res.status(StatusCodes.OK).json({ success: true, message: "Techstack updated successfully", updatedTechStack });
}

// @desc    Delete a techstack
// @route   DELETE /api/techstack/:id
// @access  Private
export const deleteTech = async (req, res) => {
    const { id } = req.params;
    const techStack = await Techstack.findByIdAndDelete(id);
    if (!techStack) {
        throw new NotFoundErr("Techstack not found");
    }
    if (techStack.imagePublicId) {
        await cloudinary.v2.uploader.destroy(techStack.imagePublicId);
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Techstack deleted successfully", techStack });
}

// @desc    Delete all techstacks
// @route   DELETE /api/techstack
// @access  Private
export const deleteAllTech = async (req, res) => {
    const techStacks = await Techstack.deleteMany();
    if (techStacks.deletedCount === 0) {
        throw new NotFoundErr("No techstacks found");
    }
    techStacks.forEach(techStack => {
        if (techStack.imagePublicId) {
            cloudinary.v2.uploader.destroy(techStack.imagePublicId);
        }
    });
    res.status(StatusCodes.OK).json({ success: true, message: "All techstacks deleted successfully", techStacks });
}