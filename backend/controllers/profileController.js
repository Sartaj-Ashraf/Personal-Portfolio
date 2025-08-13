import PersonalDetails from "../models/personalDetails.js";
import Techstack from "../models/techstackModel.js"; // Import Techstack model
import Project from "../models/projectModel.js";

import { StatusCodes } from "http-status-codes";
import { badRequestErr, NotFoundErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";

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

    console.log(newProfile);
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

export const updateProfile = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        about,
        bio,
        jobTitle,
        location,
        company,
        phoneNumber,
        username,
        email,
        totalProjects,
        totalTechStack,
        social,
        profileViews,
        lastLogin,
        isActive
    } = req.body;
    const profile = await PersonalDetails.findById(id);
    if (!profile) {
        throw new NotFoundErr("Profile not found");
    }

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

    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        profile.imageUrl = imageResponse.secure_url;
        profile.imagePublicId = imageResponse.public_id;
    }
    if (profile.name !== undefined) profile.name = name;
    if (profile.about !== undefined) profile.about = about;
    if (profile.bio !== undefined) profile.bio = bio;
    if (profile.jobTitle !== undefined) profile.jobTitle = jobTitle;
    if (profile.location !== undefined) profile.location = location;
    if (profile.company !== undefined) profile.company = company;
    if (profile.phoneNumber !== undefined) profile.phoneNumber = phoneNumber;
    if (profile.username !== undefined) profile.username = username;
    if (profile.email !== undefined) profile.email = email;
    if (profile.totalProjects !== undefined) profile.totalProjects = parsedTotalProjects;
    if (profile.totalTechStack !== undefined) profile.totalTechStack = parsedTotalTechStack;
    if (profile.social !== undefined) profile.social = social;
    if (profile.profileViews !== undefined) profile.profileViews = profileViews;
    if (profile.lastLogin !== undefined) profile.lastLogin = lastLogin;
    if (profile.isActive !== undefined) profile.isActive = isActive;
    await profile.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Profile updated successfully", profile });
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