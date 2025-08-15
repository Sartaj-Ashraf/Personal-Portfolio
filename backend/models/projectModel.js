import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String, // e.g., "Web Development", "Mobile App", "AI/ML", "Open Source"
            required: true,
        },
        status: {
            type: String,
            enum: ["Planning", "In Progress", "Completed", "On Hold"],
            default: "Planning",
        },
        techStack: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Techstack", // References your Techstack model
            },
        ],
        features: {
            type: [String],
            default: []
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        githubRepo: {
            type: String, // GitHub repository link
            match: /^https?:\/\/.+/,
        },
        liveDemo: {
            type: String, // Deployed project link
            match: /^https?:\/\/.+/,
        },
        projectImages: [
            {
                url: {
                    type: String,
                    required: true,
                },
                publicId: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("PortfolioProject", projectSchema);
