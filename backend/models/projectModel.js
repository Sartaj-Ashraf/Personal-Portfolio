import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String, // e.g., "Web Development", "Mobile App", "AI/ML", "Open Source"
            enum: ["Web Development", "Mobile App", "AI/ML", "Open Source","e-commerce", "crm", "cms", "inventory", "other"],
            default: "Web Development",
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

export default mongoose.model("Project", projectSchema);
