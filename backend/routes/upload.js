import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            { folder: "homepage" }
        );

        res.json({
            url: result.secure_url,
        });
    } catch (error) {
        res.status(500).json({ error: "Upload failed" });
    }
});

export default router;