import PersonalDetails from "../models/personalDetails.js";
import { StatusCodes } from "http-status-codes";
import { badRequestErr, NotFoundErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";
import { formatImage } from "../utils/multer.js";

// Schema Fields -  name,about,totalProjects(ref),totalTechStack(ref),username,email,phoneNumber,bio, jobTitle,location,company,social {github,linkedin,twitter,instagram},profileViews,lastLogin,isActive,imageUrl,imagePublicId,

// @desc    Create a new profile
// @route   POST /api/profile
// @access  Private
export const createProfile = async (req, res) => {
    const profileCount = await PersonalDetails.countDocuments() !== 0;
    if (profileCount) {
        throw new badRequestErr("Only one profile can be created and it exists");
    }
    // Handle image uploads
    let newProfile = { ...req.body }
    if (req.file) {
        const imageUrl = formatImage(req.file);
        const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
        newProfile.imageUrl = imageResponse.secure_url;
        newProfile.imagePublicId = imageResponse.public_id;
    }

    await PersonalDetails.create(newProfile);
    res.status(StatusCodes.CREATED).json({ success: true, message: "Profile created successfully", newProfile });
}
// @desc    Get all profiles
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res) => {
    const profile = await PersonalDetails.findOne();
    if (!profile) {
        throw new NotFoundErr("No profile not found");
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Profile fetched successfully", profile });
};

export const getProfileById = async (req, res) => {
    const { id } = req.params;
    const profile = await PersonalDetails.findById(id);
    if (!profile) {
        throw new NotFoundErr("Profile not found");
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Profile fetched successfully", profile });
}

// @desc    Update a profile
// @route   PATCH /api/profile/:id
// @access  Private
export const updateProfile = async (req, res) => {
    const { id } = req.params;
  
    // Prepare update object directly instead of overwriting profile
    const updateData = { ...req.body };

    if (req.body.social && typeof req.body.social === "string") {
        updateData.social = JSON.parse(req.body.social);
      }
  
    if (req.file) {
      const imageUrl = formatImage(req.file);
      const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
      updateData.imageUrl = imageResponse.secure_url;
      updateData.imagePublicId = imageResponse.public_id;
    }
  
    // Direct update (no need to fetch doc first unless you want to check existence)
    const updatedProfile = await PersonalDetails.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  
    if (!updatedProfile) {
      throw new NotFoundErr("Profile not found");
    }
  
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Profile updated successfully", updatedProfile });
  };
  
// @desc    Delete a profile
// @route   DELETE /api/profile/:id
// @access  Private
export const deleteProfile = async (req, res) => {
    const { id } = req.params;

    let profile = await PersonalDetails.findById(id);

    if (!profile) {
        throw new NotFoundErr("Profile not found");
    }
    if (profile.imagePublicId) {
        await cloudinary.v2.uploader.destroy(profile.imagePublicId);
    }
    await PersonalDetails.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({ success: true, message: "Profile deleted successfully", profile });

}