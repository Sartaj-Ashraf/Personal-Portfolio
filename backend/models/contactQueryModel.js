import mongoose from "mongoose";
const contactQuerySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    phone_number: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "resolved", "unresolved"],
        default: "pending"
    }
}, { timestamps: true })
export default mongoose.model("ContactQueryModel", contactQuerySchema)