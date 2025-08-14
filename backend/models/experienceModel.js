import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'temporary'],
        default: 'full-time'
    },
    startDate: {
        type: Date,
        required: true
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
