import Skill from "../models/skillsModel.js";
import { StatusCodes } from "http-status-codes";
import { formatImage } from "../utils/multer.js";
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";
import cloudinary from "cloudinary";

export const createSkill = async (req, res) => {
    const { title } = req.body;// contains title, category, proficiencyLevel, yearsOfExperience, description, order, featured

    const existingSkill = await Skill.findOne({ title: { $regex: new RegExp(`^${title}$`, "i") } });

    if (existingSkill) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Skill already exists" });
    }

    const newSkill = { ...req.body };
    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        newSkill.imageUrl = imageResponse.secure_url;
        newSkill.imagePublicId = imageResponse.public_id;
    }
    const skill = await Skill.create(newSkill);
    res.status(StatusCodes.CREATED).json({ success: true, message: "Skill created successfully", skill });

}

export const getAllSkills = async (req, res) => {
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
        const skills = await Skill.find(queryObject)
            .skip(skip)
            .limit(limit);
        const totalDocs = await Skill.countDocuments(queryObject);
        const paginationInfo = getPaginationInfo(totalDocs, page, limit);
        return res
            .status(StatusCodes.OK)
            .json({ success: true, message: "Skills fetched successfully", skills, paginationInfo });
    }
    const skills = await Skill.find(queryObject);
    res
        .status(StatusCodes.OK)
        .json({ success: true, message: "Skills fetched successfully", skills });
}

export const updateSkills = async (req, res) => {
    const { id } = req.params;
    const existingSkill = await Skill.findById(id);

    if (!existingSkill) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Skill not found" });
    }

    const newSkill = { ...req.body };

    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        newSkill.imageUrl = imageResponse.secure_url;
        newSkill.imagePublicId = imageResponse.public_id;
    }

    if (existingSkill.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingSkill.imagePublicId);
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, newSkill, { new: true });
    res.status(StatusCodes.OK).json({ success: true, message: "Skill updated successfully", updatedSkill });
}

export const deleteSkill = async (req, res) => {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Skill not found" });
    }
    if (skill.imagePublicId) {
        await cloudinary.v2.uploader.destroy(skill.imagePublicId);
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Skill deleted successfully", skill });
}
export const deleteAllSkills = async (req, res) => {
    const skills = await Skill.deleteMany();
    if (skills.deletedCount === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "No skills found" });
    }
    res.status(StatusCodes.OK).json({ success: true, message: "All skills deleted successfully", skills });
}