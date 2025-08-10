import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "DevOps",
        "Database",
        "Cloud",
        "Programming Language",
        "Testing",
        "Other",
      ],
    },

    proficiencyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String, // URL or path to icon (e.g., TailwindCSS logo)
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },

    order: {
      type: Number, // To control display order in frontend
      default: 0,
    },

    featured: {
      type: Boolean, // Whether to highlight this skill
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
