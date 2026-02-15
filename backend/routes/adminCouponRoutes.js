import express from "express";
import Coupon from "../models/Coupon.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   CREATE COUPON (ADMIN)
================================ */
router.post("/", adminAuth, async (req, res) => {
    try {
        const {
            code,
            type,
            value,
            maxUses,
            expiresAt,
            note,
        } = req.body;

        // ===== VALIDATION =====
        if (!code || !type || value === undefined) {
            return res.status(400).json({
                error: "Missing required fields",
            });
        }

        if (!["fixed", "percent"].includes(type)) {
            return res.status(400).json({
                error: "Invalid coupon type",
            });
        }

        if (value < 0) {
            return res.status(400).json({
                error: "Coupon value cannot be negative",
            });
        }

        if (type === "percent" && value > 100) {
            return res.status(400).json({
                error: "Percent value cannot exceed 100",
            });
        }

        const normalizedCode = code.toUpperCase().trim();

        const exists = await Coupon.findOne({
            code: normalizedCode,
        });

        if (exists) {
            return res.status(400).json({
                error: "Coupon code already exists",
            });
        }

        const coupon = await Coupon.create({
            code: normalizedCode,
            type,
            value,
            maxUses: maxUses ?? null,
            expiresAt: expiresAt ?? null,
            note: note || "",
            active: true,
        });

        res.status(201).json(coupon);
    } catch (err) {
        console.error("Create coupon error:", err);
        res.status(500).json({
            error: "Failed to create coupon",
        });
    }
});

/* ===============================
   GET ALL COUPONS (ADMIN)
================================ */
router.get("/", adminAuth, async (_req, res) => {
    try {
        const coupons = await Coupon.find().sort({
            createdAt: -1,
        });

        res.json(coupons);
    } catch (err) {
        console.error("Fetch coupons error:", err);
        res.status(500).json({
            error: "Failed to fetch coupons",
        });
    }
});

/* ===============================
   TOGGLE COUPON ACTIVE
================================ */
router.patch("/:id/toggle", adminAuth, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                error: "Coupon not found",
            });
        }

        coupon.active = !coupon.active;
        await coupon.save();

        res.json(coupon);
    } catch (err) {
        console.error("Toggle coupon error:", err);
        res.status(500).json({
            error: "Failed to update coupon",
        });
    }
});

/* ===============================
   DELETE COUPON (ADMIN)
================================ */
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                error: "Coupon not found",
            });
        }

        await coupon.deleteOne();
        res.json({ success: true });
    } catch (err) {
        console.error("Delete coupon error:", err);
        res.status(500).json({
            error: "Failed to delete coupon",
        });
    }
});

export default router;