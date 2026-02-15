import express from "express";
import Image from "../models/Image.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   GET ALL MEDIA (ADMIN)
================================ */
router.get("/", adminAuth, async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;