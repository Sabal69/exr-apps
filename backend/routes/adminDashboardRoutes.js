import express from "express";
import Order from "../models/order.js";
import Product from "../models/Product.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   ADMIN DASHBOARD STATS
================================ */
router.get("/stats", adminAuth, async (_req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "pending",
        });

        const totalRevenueAgg = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const totalRevenue = totalRevenueAgg[0]?.total || 0;

        const lowStock = await Product.countDocuments({
            stock: { $lte: 5 },
        });

        res.json({
            totalOrders,
            pendingOrders,
            totalRevenue,
            lowStock,
        });
    } catch (err) {
        console.error("DASHBOARD STATS ERROR:", err);
        res.status(500).json({
            error: "Failed to load dashboard stats",
        });
    }
});

/* ===============================
   RECENT ORDERS (ADMIN)
================================ */
router.get("/recent", adminAuth, async (_req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
                "_id totalAmount paymentMethod orderStatus paymentStatus createdAt"
            );

        res.json(recentOrders);
    } catch (err) {
        console.error("RECENT ORDERS ERROR:", err);
        res.status(500).json({
            error: "Failed to load recent orders",
        });
    }
});

export default router;