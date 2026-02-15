import express from "express";
import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/Product.js";
import AdminWallet from "../models/AdminWallet.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   GET ALL ORDERS (ADMIN)
================================ */
router.get("/", adminAuth, async (_req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error("FETCH ORDERS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

/* ===============================
   UPDATE ORDER STATUS (ADMIN)
   ❌ NO REFUNDS HERE
================================ */
router.patch("/:id/status", adminAuth, async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "paid",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid order status" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.orderStatus === "cancelled") {
            return res
                .status(400)
                .json({ error: "Cancelled orders cannot be modified" });
        }

        if (status === "paid") {
            order.paymentStatus = "paid";
        }

        order.orderStatus = status;
        await order.save();

        res.json(order);
    } catch (err) {
        console.error("UPDATE ORDER STATUS ERROR:", err);
        res.status(500).json({ error: "Failed to update order status" });
    }
});

/* ===============================
   ISSUE STORE CREDIT REFUND (ADMIN)
================================ */
router.post("/:id/refund-wallet", adminAuth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(req.params.id).session(session);
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Order not found" });
        }

        // Must be requested first
        if (!order.refundRequested || order.refundStatus !== "requested") {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                error: "Refund has not been requested by customer",
            });
        }

        // Policy enforcement
        if (
            order.refundReason === "change_of_mind" ||
            order.refundReason === "size_issue"
        ) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                error: "This order is not eligible for wallet refund",
            });
        }

        // Prevent double refund
        if (order.refundStatus === "refunded") {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                error: "Order already refunded",
            });
        }

        // Load or create wallet
        let wallet = await AdminWallet.findOne().session(session);
        if (!wallet) {
            const [created] = await AdminWallet.create(
                [{ balance: 0, transactions: [] }],
                { session }
            );
            wallet = created;
        }

        // Guard: refund once per order
        if (wallet.hasRefundForOrder(order._id)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                error: "Wallet refund already exists for this order",
            });
        }

        // Credit wallet
        wallet.addTransaction({
            type: "refund",
            amount: order.totalAmount,
            note: `Refund for order ${order._id}`,
            relatedOrderId: order._id,
            source: "system",
        });

        await wallet.save({ session });

        // Update order refund meta
        order.refundStatus = "refunded";
        order.refundMethod = "wallet";
        order.refundAmount = order.totalAmount;
        order.refundedAt = new Date();
        order.refundedBy = req.admin._id;

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({
            success: true,
            message: "Store credit refund issued successfully",
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("WALLET REFUND ERROR:", err);
        res.status(500).json({
            error: "Failed to issue wallet refund",
        });
    }
});

export default router;