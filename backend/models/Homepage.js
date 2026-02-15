import mongoose from "mongoose";

/* ===============================
   SECTION SCHEMA (UUID SAFE)
================================ */
const sectionSchema = new mongoose.Schema(
    {
        _id: {
            type: String, // UUID from frontend
            required: true,
        },

        type: {
            type: String,
            required: true,
            // ❗ ENUM INTENTIONALLY REMOVED
            // Allows hero, contact, future sections
        },

        order: {
            type: Number,
            default: 0,
        },

        enabled: {
            type: Boolean,
            default: true,
        },

        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        _id: false, // ⛔ prevent ObjectId conflicts
    }
);

/* ===============================
   HOMEPAGE SCHEMA (DRAFT + LIVE)
================================ */
const homepageSchema = new mongoose.Schema(
    {
        // 📝 ADMIN EDITING (DRAFT)
        draftSections: {
            type: [sectionSchema],
            default: [],
        },

        // 🌍 PUBLIC WEBSITE (LIVE)
        publishedSections: {
            type: [sectionSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

/* ===============================
   MODEL (ESM + NODE 25 SAFE)
   ✅ prevents OverwriteModelError
================================ */
const Homepage =
    mongoose.models.Homepage ||
    mongoose.model("Homepage", homepageSchema);

export default Homepage;