import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 8,
    },
    avatar: {
        type: String,
        default: 'https://i.ibb.co/default-avatar.png'
    },
    bio: {
        type: String,
        maxlength: 300
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    },
    providerId: {
        type: String
    },
    social: {
        github: { type: String },
        linkedin: { type: String },
        twitter: { type: String },
        website: { type: String }
    },
    lastLogin: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true })
export default mongoose.model("PortfolioUserModel", userSchema)