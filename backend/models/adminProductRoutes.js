import express from "express";
import Product from "../models/Product.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ===============================
   GET ALL PRODUCTS (ADMIN)
================================ */
router.get("/", adminAuth, async (_req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error("Admin fetch products error:", err);
        res.status(500).json({ error: "Failed to load products" });
    }
});

/* ===============================
   CREATE PRODUCT (ADMIN)
================================ */
router.post(
    "/",
    adminAuth,
    upload.array("images", 6),
    async (req, res) => {
        try {
            const {
                title,
                description = "",
                category,
                price,
                stock,
                featured,
                sizes,
            } = req.body;

            if (!title || !category || price === undefined || stock === undefined) {
                return res.status(400).json({
                    error: "Missing required fields",
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    error: "At least one image is required",
                });
            }

            let parsedSizes = [];
            try {
                parsedSizes = sizes ? JSON.parse(sizes) : [];
            } catch {
                return res.status(400).json({
                    error: "Invalid sizes format",
                });
            }

            const images = req.files.map(
                file => `/uploads/${file.filename}`
            );

            const product = await Product.create({
                title,
                description,
                category,
                price: Number(price),
                stock: Number(stock),
                featured: featured === "true" || featured === true,
                sizes: parsedSizes,
                images,
                isActive: true,
            });

            res.status(201).json(product);
        } catch (err) {
            console.error("Create product error:", err);
            res.status(500).json({ error: "Create failed" });
        }
    }
);

/* ===============================
   UPDATE STOCK (ADMIN)
================================ */
router.patch("/:id/stock", adminAuth, async (req, res) => {
    try {
        const { stock } = req.body;

        if (stock === undefined || stock < 0) {
            return res.status(400).json({
                error: "Invalid stock value",
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock: Number(stock) },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        res.json(product);
    } catch (err) {
        console.error("Update stock error:", err);
        res.status(500).json({ error: "Failed to update stock" });
    }
});

/* ===============================
   DELETE PRODUCT (ADMIN)
================================ */
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Delete product error:", err);
        res.status(500).json({ error: "Delete failed" });
    }
});

export default router;