import express from "express";
import Product from "../models/Product.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ===============================
   GET ALL PRODUCTS (PUBLIC)
================================ */
router.get("/", async (_req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (err) {
        console.error("Fetch products error:", err);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

/* ===============================
   GET SINGLE PRODUCT (PUBLIC)
================================ */
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || !product.isActive) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch {
        res.status(400).json({ message: "Invalid product ID" });
    }
});

/* ===============================
   ❤️ WAITLIST JOIN (PUBLIC)
================================ */
router.post("/:id/waitlist", async (req, res) => {
    try {
        const email = String(req.body.email || "")
            .toLowerCase()
            .trim();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const added = product.addToWaitlist(email);

        if (!added) {
            return res.json({
                success: true,
                message: "Already on waitlist",
            });
        }

        await product.save();

        res.json({
            success: true,
            message: "Added to waitlist",
        });
    } catch (err) {
        console.error("Waitlist error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to join waitlist",
        });
    }
});

/* ===============================
   📊 WAITLIST (ADMIN ONLY)
   GET /api/products/:id/waitlist
================================ */
router.get("/:id/waitlist", adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select(
            "title waitlist"
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json({
            productId: product._id,
            title: product.title,
            waitlistCount: product.waitlist.length,
            waitlist: product.waitlist,
        });
    } catch (err) {
        console.error("Admin waitlist fetch error:", err);
        res.status(500).json({
            message: "Failed to fetch waitlist",
        });
    }
});

/* ===============================
   ❤️ GET WAITLIST (ADMIN ONLY)
================================ */
router.get("/:id/waitlist", adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .select("title waitlist");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            productId: product._id,
            title: product.title,
            count: product.waitlist.length,
            waitlist: product.waitlist,
        });
    } catch (err) {
        console.error("Admin waitlist fetch error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch waitlist",
        });
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
                description,
                category,
                price,
                stock,
                featured,
                sizes,
                showInShop,
                heroVisible,
            } = req.body;

            if (!title || !price || stock === undefined) {
                return res.status(400).json({
                    message: "Title, price, and stock are required",
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: "At least one image is required",
                });
            }

            const images = req.files.map(
                file => `/uploads/${file.filename}`
            );

            let parsedSizes = [];
            try {
                parsedSizes = sizes ? JSON.parse(sizes) : [];
            } catch {
                return res.status(400).json({
                    message: "Invalid sizes format",
                });
            }

            const product = await Product.create({
                title,
                description,
                category,
                price: Number(price),
                stock: Number(stock),
                featured: featured === "true" || featured === true,
                showInShop: showInShop !== "false",
                heroVisible: heroVisible === "true",
                sizes: parsedSizes,
                images,
                isActive: true,
            });

            res.json(product);
        } catch (err) {
            console.error("Create product error:", err);
            res.status(500).json({ message: "Create failed" });
        }
    }
);

/* ===============================
   DELETE PRODUCT (ADMIN)
================================ */
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error("Delete product error:", err);
        res.status(400).json({ message: "Delete failed" });
    }
});

export default router;