import mongoose from "mongoose";

/* ===============================
   SEO SCHEMA (GLOBAL – SINGLE DOC)
================================ */
const seoSchema = new mongoose.Schema(
    {
        // 🔖 Website title (optional, future use)
        title: {
            type: String,
            default: "ESSENCE × REBIRTH",
        },

        // 📝 Description for social previews
        description: {
            type: String,
            default: "",
        },

        // 🖼️ SOCIAL PREVIEW IMAGE (MAIN GOAL)
        previewImage: {
            type: String, // image URL (/uploads/...)
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

/*
  ⚠️ IMPORTANT
  We keep ONLY ONE SEO document
*/
export default mongoose.model("Seo", seoSchema);