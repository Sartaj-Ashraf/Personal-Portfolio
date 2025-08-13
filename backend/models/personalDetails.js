import mongoose from "mongoose";

const PersonalDetails = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    about: {
        type: String,
        trim: true
    },
    // References to projects and tech stack
    totalProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    }],
    totalTechStack: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Techstack",
    }],

    username: {
        type: String,
        unique: true,

        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
    },

    imageUrl: {
        type: String,
        default: 'https://i.ibb.co/default-avatar.png'
    },
    imagePublicId: {
        type: String,
        default: 'default-avatar'
    },
    bio: {
        type: String,
        maxlength: 300
    },
    // Professional details
    jobTitle: { type: String, trim: true },
    location: { type: String, trim: true },
    company: { type: String, trim: true },

    // Social & portfolio links
    social: {
        github: { type: String, trim: true },
        linkedin: { type: String, trim: true },
        twitter: { type: String, trim: true },
        instagram: { type: String, trim: true },
    },

    // Optional analytics / engagement
    profileViews: { type: Number, default: 0 },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("PersonalDetails", PersonalDetails);
