import express from "express";
import mongoose from "mongoose";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   PROFILE SCHEMA (INLINE SAFE)
================================ */
const profileSchema = new mongoose.Schema(
    {
        siteName: {
            type: String,
            default: "EXR",
        },

        tagline: {
            type: String,
            default: "",
        },

        logo: {
            type: String, // image URL
            default: "",
        },

        instagram: {
            type: String,
            default: "",
        },

        tiktok: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Profile =
    mongoose.models.Profile ||
    mongoose.model("Profile", profileSchema);

/* ===============================
   🌍 PUBLIC — GET PROFILE
================================ */
router.get("/", async (req, res) => {
    try {
        let profile = await Profile.findOne().lean();

        // ✅ Always return one profile
        if (!profile) {
            profile = await Profile.create({});
        }

        res.json(profile);
    } catch (err) {
        console.error("❌ Profile load failed:", err);
        res.status(500).json({ error: "Profile load failed" });
    }
});

/* ===============================
   🔐 ADMIN — UPDATE PROFILE
================================ */
router.put("/", adminAuth, async (req, res) => {
    try {
        const {
            siteName,
            tagline,
            logo,
            instagram,
            tiktok,
        } = req.body;

        let profile = await Profile.findOne();

        if (!profile) {
            profile = new Profile();
        }

        profile.siteName = siteName ?? profile.siteName;
        profile.tagline = tagline ?? profile.tagline;
        profile.logo = logo ?? profile.logo;
        profile.instagram = instagram ?? profile.instagram;
        profile.tiktok = tiktok ?? profile.tiktok;

        await profile.save();

        res.json({ success: true, profile });
    } catch (err) {
        console.error("❌ Profile save failed:", err);
        res.status(500).json({ error: "Profile save failed" });
    }
});

export default router;