import express from "express";
import Coupon from "../models/Coupon.js";

const router = express.Router();

/* ===============================
   VALIDATE COUPON (PUBLIC)
================================ */
router.post("/validate", async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        /* ================= VALIDATION ================= */
        if (!code || subtotal === undefined) {
            return res.status(400).json({
                error: "Coupon code and subtotal required",
            });
        }

        const safeSubtotal = Number(subtotal);

        if (isNaN(safeSubtotal) || safeSubtotal <= 0) {
            return res.status(400).json({
                error: "Invalid subtotal",
            });
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase().trim(),
        });

        if (!coupon) {
            return res.status(404).json({
                error: "Invalid coupon code",
            });
        }

        /* ================= STATUS CHECKS ================= */
        if (!coupon.active) {
            return res.status(400).json({
                error: "Coupon is inactive",
            });
        }

        if (
            coupon.expiresAt &&
            new Date(coupon.expiresAt) < new Date()
        ) {
            return res.status(400).json({
                error: "Coupon has expired",
            });
        }

        if (
            coupon.maxUses !== null &&
            coupon.usedCount >= coupon.maxUses
        ) {
            return res.status(400).json({
                error: "Coupon usage limit reached",
            });
        }

        /* ================= DISCOUNT LOGIC ================= */
        let discount = 0;

        if (coupon.type === "fixed") {
            discount = coupon.value;
        }

        if (coupon.type === "percent") {
            discount = Math.round(
                (safeSubtotal * coupon.value) / 100
            );
        }

        // Prevent negative totals
        if (discount > safeSubtotal) {
            discount = safeSubtotal;
        }

        const finalTotal = safeSubtotal - discount;

        res.json({
            valid: true,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discount,
            finalTotal,
        });
    } catch (err) {
        console.error("COUPON VALIDATION ERROR:", err);
        res.status(500).json({
            error: "Failed to validate coupon",
        });
    }
});

export default router;