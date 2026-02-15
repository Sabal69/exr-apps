import mongoose from "mongoose";

/* ===============================
   PROFILE SCHEMA (ADMIN MANAGED)
================================ */
const profileSchema = new mongoose.Schema(
    {
        // Brand / Profile name
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // Short subtitle or description
        subtitle: {
            type: String,
            default: "",
        },

        // Logo image path (uploaded by admin)
        logo: {
            type: String,
            default: "",
        },

        // Optional status text like "Updated 14 hours ago"
        statusText: {
            type: String,
            default: "",
        },

        // Control visibility
        published: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // createdAt / updatedAt
    }
);

export default mongoose.model("Profile", profileSchema);