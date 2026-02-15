import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import Order from "../models/order.js";
import AdminWallet from "../models/AdminWallet.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ===============================
   STRIPE WEBHOOK
   SINGLE SOURCE OF TRUTH
================================ */
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("❌ Stripe signature error:", err.message);
            return res.status(400).send(`Webhook Error`);
        }

        /* ===============================
           PAYMENT SUCCESS
        ================================ */
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;

            if (!orderId) {
                return res.json({ received: true });
            }

            const dbSession = await mongoose.startSession();
            dbSession.startTransaction();

            try {
                const order = await Order.findById(orderId)
                    .session(dbSession);

                if (!order || order.paymentStatus === "paid") {
                    await dbSession.abortTransaction();
                    dbSession.endSession();
                    return res.json({ received: true });
                }

                /* MARK ORDER PAID */
                order.paymentStatus = "paid";
                order.orderStatus = "paid";
                await order.save({ session: dbSession });

                /* CREDIT WALLET */
                let wallet = await AdminWallet.findOne()
                    .session(dbSession);

                if (!wallet) {
                    const [created] = await AdminWallet.create(
                        [
                            {
                                balance: 0,
                                currency: "NPR",
                                transactions: [],
                            },
                        ],
                        { session: dbSession }
                    );
                    wallet = created;
                }

                wallet.balance += order.totalAmount;

                wallet.transactions.unshift({
                    type: "credit",
                    amount: order.totalAmount,
                    note: `Stripe payment — Order ${order._id}`,
                    relatedOrderId: order._id,
                });

                await wallet.save({ session: dbSession });

                await dbSession.commitTransaction();
                dbSession.endSession();
            } catch (err) {
                await dbSession.abortTransaction();
                dbSession.endSession();
                console.error("❌ Stripe webhook error:", err);
            }
        }

        res.json({ received: true });
    }
);

export default router;