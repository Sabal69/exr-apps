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
        const products = await Product.find().sort({
            createdAt: -1,
        });

        res.json(products);
    } catch (err) {
        console.error("ADMIN FETCH PRODUCTS ERROR:", err);
        res.status(500).json({
            message: "Failed to fetch products",
        });
    }
});

/* ===============================
   CREATE PRODUCT (ADMIN)
================================ */
router.post(
    "/",
    adminAuth,
    (req, res, next) => {
        upload.array("images", 6)(req, res, err => {
            if (err) {
                return res.status(400).json({
                    message: err.message || "Image upload failed",
                });
            }
            next();
        });
    },
    async (req, res) => {
        try {
            const {
                title,
                category,
                price,
                stock,
                featured,
                sizes,
            } = req.body;

            /* ===== VALIDATION ===== */
            if (!title || !category || !price || stock === undefined) {
                return res.status(400).json({
                    message:
                        "Title, category, price, and stock are required",
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: "At least one image is required",
                });
            }

            let parsedSizes = [];
            try {
                parsedSizes = sizes ? JSON.parse(sizes) : [];
            } catch {
                return res.status(400).json({
                    message: "Invalid sizes format",
                });
            }

            const images = req.files.map(
                file => `/uploads/${file.filename}`
            );

            const product = await Product.create({
                title: title.trim(),
                category: category.toLowerCase().trim(),
                price: Number(price),
                stock: Number(stock),
                featured: featured === "true" || featured === true,
                sizes: parsedSizes,
                images,
                description: "",
                isActive: true,
            });

            res.status(201).json(product);
        } catch (err) {
            console.error("ADMIN CREATE PRODUCT ERROR:", err);
            res.status(500).json({
                message: "Failed to create product",
            });
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
                message: "Invalid stock value",
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        product.stock = Number(stock);
        await product.save(); // 🔥 triggers waitlist auto-clear

        res.json(product);
    } catch (err) {
        console.error("UPDATE STOCK ERROR:", err);
        res.status(500).json({
            message: "Failed to update stock",
        });
    }
});

/* ===============================
   DELETE PRODUCT (ADMIN)
================================ */
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("DELETE PRODUCT ERROR:", err);
        res.status(500).json({
            message: "Failed to delete product",
        });
    }
});

export default router;