import PersonalDetails from "../models/personalDetails.js";
import Techstack from "../models/techstackModel.js"; // Import Techstack model
import Project from "../models/projectModel.js";

import { StatusCodes } from "http-status-codes";
import { badRequestErr, NotFoundErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";

// Schema Fields -  name,about,totalProjects(ref),totalTechStack(ref),username,email,phoneNumber,bio, jobTitle,location,company,social {github,linkedin,twitter,instagram},profileViews,lastLogin,isActive,imageUrl,imagePublicId,

// @desc    Create a new profile
// @route   POST /api/profile
// @access  Private
export const createProfile = async (req, res) => {
    const { totalProjects, totalTechStack } = req.body;
    let parsedTotalProjects = totalProjects;
    let parsedTotalTechStack = totalTechStack;
    if (typeof totalProjects === 'string') {
        try {
            parsedTotalProjects = JSON.parse(totalProjects);
        } catch (error) {
            throw new badRequestErr("Invalid projects format");
        }
    }

    if (typeof totalTechStack === 'string') {
        try {
            parsedTotalTechStack = JSON.parse(totalTechStack);
        } catch (error) {
            throw new badRequestErr("Invalid techStack format");
        }
    }
    // Validate techStack ObjectIds if provided
    if (parsedTotalTechStack && parsedTotalTechStack.length > 0) {
        const validTechStacks = await Techstack.find({
            _id: { $in: parsedTotalTechStack }
        }).select('_id');

        if (validTechStacks.length !== parsedTotalTechStack.length) {
            throw new badRequestErr("One or more techStack IDs are invalid");
        }
    }
    if (parsedTotalProjects && parsedTotalProjects.length > 0) {
        const validProjects = await Project.find({
            _id: { $in: parsedTotalProjects }
        }).select('_id');

        if (validProjects.length !== parsedTotalProjects.length) {
            throw new badRequestErr("One or more project IDs are invalid");
        }
    }
    // Handle image uploads
    const newProfile = new PersonalDetails({
        ...req.body,
        totalProjects: parsedTotalProjects,
        totalTechStack: parsedTotalTechStack,
    });

    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        newProfile.imageUrl = imageResponse.secure_url;
        newProfile.imagePublicId = imageResponse.public_id;
    }

    await newProfile.save();
    res.status(StatusCodes.CREATED).json({ success: true, message: "Profile created successfully", newProfile });
}
// @desc    Get all profiles
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res) => {
    const profile = await PersonalDetails.find();
    if (!profile) {
        throw new NotFoundErr("No profile not found");
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Profile fetched successfully", data: profile });
};

// @desc    Update a profile
// @route   PATCH /api/profile/:id
// @access  Private
export const updateProfile = async (req, res) => {
    const { id } = req.params;
    const {
        totalProjects,
        totalTechStack,
    } = req.body;

    const profile = await PersonalDetails.findById(id);
    if (!profile) {
        throw new NotFoundErr("Profile not found");
    }

    let fieldsToUpdate = { ...req.body }

    let parsedTotalProjects = totalProjects;
    let parsedTotalTechStack = totalTechStack;
    if (typeof totalProjects === 'string') {
        try {
            parsedTotalProjects = JSON.parse(totalProjects);
        } catch (error) {
            throw new badRequestErr("Invalid techStack format");
        }
    }

    if (typeof totalTechStack === 'string') {
        try {
            parsedTotalTechStack = JSON.parse(totalTechStack);
        } catch (error) {
            throw new badRequestErr("Invalid features format");
        }
    }

    // Validate techStack ObjectIds if provided
    if (parsedTotalTechStack && parsedTotalTechStack.length > 0) {
        const validTechStacks = await Techstack.find({
            _id: { $in: parsedTotalTechStack }
        }).select('_id');

        if (validTechStacks.length !== parsedTotalTechStack.length) {
            throw new badRequestErr("One or more techStack IDs are invalid");
        } else {
            fieldsToUpdate.totalTechStack = parsedTotalTechStack;
        }
    }
    if (parsedTotalProjects && parsedTotalProjects.length > 0) {
        const validProjects = await Project.find({
            _id: { $in: parsedTotalProjects }
        }).select('_id');

        if (validProjects.length !== parsedTotalProjects.length) {
            throw new badRequestErr("One or more project IDs are invalid");
        } else {
            fieldsToUpdate.totalProjects = parsedTotalProjects;
        }
    }

    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        fieldsToUpdate.imageUrl = imageResponse.secure_url;
        fieldsToUpdate.imagePublicId = imageResponse.public_id;
    }

    fieldsToUpdate = await PersonalDetails.findByIdAndUpdate(id, fieldsToUpdate, { new: true });
    res.status(StatusCodes.OK).json({ success: true, message: "Profile updated successfully", fieldsToUpdate });
}

// @desc    Delete a profile
// @route   DELETE /api/profile/:id
// @access  Private
export const deleteProfile = async (req, res) => {
    const { id } = req.params;

    const profile = await PersonalDetails.findById(id);

    if (!profile) {
        throw new NotFoundErr("Profile not found");
    }
    if (profile.imagePublicId) {
        await cloudinary.v2.uploader.destroy(profile.imagePublicId);
    }
    await PersonalDetails.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({ success: true, message: "Profile deleted successfully", profile });

}