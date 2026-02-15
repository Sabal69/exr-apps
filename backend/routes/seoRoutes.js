import express from "express";
import Seo from "../models/Seo.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   PUBLIC: GET SEO DATA
================================ */
router.get("/", async (_req, res) => {
    try {
        let seo = await Seo.findOne();

        if (!seo) {
            seo = await Seo.create({});
        }

        res.json(seo);
    } catch (err) {
        console.error("❌ SEO load failed:", err);
        res.status(500).json({ error: "SEO load failed" });
    }
});

/* ===============================
   ADMIN: UPDATE SEO
================================ */
router.put("/", adminAuth, async (req, res) => {
    try {
        const { title, description, previewImage } = req.body;

        let seo = await Seo.findOne();

        if (!seo) {
            seo = new Seo();
        }

        if (title !== undefined) seo.title = title;
        if (description !== undefined) seo.description = description;
        if (previewImage !== undefined) seo.previewImage = previewImage;

        await seo.save();

        res.json({ success: true, seo });
    } catch (err) {
        console.error("❌ SEO update failed:", err);
        res.status(500).json({ error: "SEO update failed" });
    }
});

export default router;