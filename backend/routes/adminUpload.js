import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   PATH SETUP
================================ */
const UPLOAD_DIR = path.resolve("uploads");

/* Ensure uploads folder exists */
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    },
});

/* ===============================
   POST /api/admin/upload
   Upload single image
================================ */
router.post(
    "/upload",
    adminAuth,
    upload.single("image"),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        res.json({
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
        });
    }
);

/* ===============================
   GET /api/admin/media
   List uploaded images (for picker)
================================ */
router.get("/media", adminAuth, (_req, res) => {
    try {
        const files = fs
            .readdirSync(UPLOAD_DIR)
            .filter(f =>
                /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
            )
            .sort((a, b) => {
                const aTime = fs.statSync(
                    path.join(UPLOAD_DIR, a)
                ).mtime.getTime();
                const bTime = fs.statSync(
                    path.join(UPLOAD_DIR, b)
                ).mtime.getTime();
                return bTime - aTime;
            })
            .map(f => `/uploads/${f}`);

        res.json(files);
    } catch (err) {
        res.status(500).json({
            message: "Failed to read uploads directory",
        });
    }
});

export default router;