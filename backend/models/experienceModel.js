import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    company: {
        type: String,
   
        trim: true
    },
    location: {
        type: String,
        enum: ['remote', 'on-site', "hybrid", "other"],
        default: 'remote',
        trim: true
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'temporary', 'other'],
        default: 'other'
    },
    companyWebsite: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        trim: true
    },
    coverImagePublicId: {
        type: String,
        trim: true
    },
    companyLogo: {
        type: String,
        trim: true
    },
    companyLogoPublicId: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        
    },
    endDate: {
        type: Date
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    keyPoints: {
        type: [String],
        trim: true
    },
    achievements: {
        type: [String],
        trim: true
    },
    challenges: {
        type: [String],
        trim: true
    },
    technologiesUsed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Techstack"
    }],

}, { timestamps: true });

export default mongoose.model("Experience", ExperienceSchema);
