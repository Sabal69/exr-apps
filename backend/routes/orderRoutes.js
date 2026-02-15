import express from "express";
import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Settings from "../models/Settings.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

/* ===================================================
   CREATE ORDER (LOGIN REQUIRED)
=================================================== */
router.post("/", userAuth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            items,
            shipping,
            totalAmount,
            paymentMethod = "cod",
            coupon = null,
        } = req.body;

        /* ================= SETTINGS ================= */
        const settings = await Settings.getSingleton();

        if (settings.maintenanceMode) {
            await session.abortTransaction();
            session.endSession();
            return res.status(503).json({
                error: "Store is under maintenance",
            });
        }

        /* ================= PAYMENT CHECK ================= */
        const paymentMap = {
            cod: settings.codEnabled,
            stripe: settings.stripeEnabled,
            esewa: settings.esewaEnabled,
            khalti: settings.khaltiEnabled,
        };

        if (!paymentMap[paymentMethod]) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                error: `${paymentMethod} payments are disabled`,
            });
        }

        /* ================= VALIDATION ================= */
        if (
            !Array.isArray(items) ||
            items.length === 0 ||
            !shipping ||
            typeof totalAmount !== "number"
        ) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                error: "Invalid order data",
            });
        }

        /* ================= STOCK CHECK ================= */
        for (const item of items) {
            const updated = await Product.findOneAndUpdate(
                {
                    _id: item._id,
                    stock: { $gte: item.quantity },
                },
                { $inc: { stock: -item.quantity } },
                { new: true, session }
            );

            if (!updated) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    error: `Insufficient stock for ${item.title}`,
                });
            }
        }

        /* ================= COUPON ================= */
        let appliedCoupon = null;

        if (coupon?.code) {
            const couponDoc = await Coupon.findOne({
                code: coupon.code,
                active: true,
            }).session(session);

            if (!couponDoc) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    error: "Coupon invalid",
                });
            }

            if (
                couponDoc.maxUses !== null &&
                couponDoc.usedCount >= couponDoc.maxUses
            ) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    error: "Coupon limit reached",
                });
            }

            couponDoc.usedCount += 1;
            await couponDoc.save({ session });

            appliedCoupon = {
                code: couponDoc.code,
                type: couponDoc.type,
                value: couponDoc.value,
                discount: coupon.discount || 0,
            };
        }

        /* ================= CREATE ORDER ================= */
        const [order] = await Order.create(
            [
                {
                    user: req.user.userId,
                    items,
                    shipping,
                    totalAmount,
                    paymentMethod,
                    paymentStatus: "pending",
                    orderStatus: "pending",
                    coupon: appliedCoupon,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            orderId: order._id,
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("CREATE ORDER ERROR:", err);
        return res.status(500).json({
            error: "Failed to create order",
        });
    }
});

/* ===================================================
   GET MY ORDERS
=================================================== */
router.get("/my-orders", userAuth, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId,
        })
            .sort({ createdAt: -1 })
            .populate("user", "name email");

        return res.json({
            success: true,
            orders,
        });
    } catch (err) {
        console.error("FETCH MY ORDERS ERROR:", err);
        return res.status(500).json({
            error: "Failed to fetch orders",
        });
    }
});

/* ===================================================
   REQUEST REFUND
=================================================== */
router.post("/:id/refund-request", userAuth, async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!order) {
            return res.status(404).json({
                error: "Order not found",
            });
        }

        if (order.refundRequested) {
            return res.status(400).json({
                error: "Refund already requested",
            });
        }

        const allowedReasons = [
            "size_issue",
            "damaged_item",
            "wrong_item",
        ];

        if (!allowedReasons.includes(reason)) {
            return res.status(400).json({
                error: "Invalid refund reason",
            });
        }

        const now = new Date();
        const daysPassed =
            (now - order.updatedAt) / (1000 * 60 * 60 * 24);

        if (daysPassed > 7) {
            return res.status(400).json({
                error: "Refund window expired",
            });
        }

        order.refundRequested = true;
        order.refundRequestedAt = now;
        order.refundReason = reason;
        order.refundStatus = "requested";

        await order.save();

        return res.json({
            success: true,
            message: "Refund request submitted",
        });
    } catch (err) {
        console.error("REFUND REQUEST ERROR:", err);
        return res.status(500).json({
            error: "Failed to submit refund request",
        });
    }
});

/* ===================================================
   GET SINGLE ORDER
=================================================== */
router.get("/:id", userAuth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!order) {
            return res.status(404).json({
                error: "Order not found",
            });
        }

        return res.json(order);
    } catch (err) {
        console.error("FETCH ORDER ERROR:", err);
        return res.status(500).json({
            error: "Failed to load order",
        });
    }
});

export default router;