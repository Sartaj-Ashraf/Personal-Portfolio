import mongoose from "mongoose"
const techstackSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: [
            "Frontend",
            "Backend",
            "Database",
            "DevOps",
            "Mobile",
            "Testing",
            "Cloud",
            "UI/UX",
            "Other"
        ],
        default: "Other",
    },
    description: {
        type: String,
        trim: true,
    },
    proficiencyLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
        default: "Intermediate",
    },
    keypoints: {
        type: [String],
        default: []
    },
    referenceWebsite: {
        type: [String],
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true
    },
    imagePublicId: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
export default mongoose.model("Techstack", techstackSchema)
