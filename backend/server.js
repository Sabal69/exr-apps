import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import path from "path";

import connectDB from "./config/db.js";

/* ================= ROUTES ================= */
import contactRoutes from "./routes/contactRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";

/* ===== USER AUTH ROUTES ===== */
import authRoutes from "./routes/authRoutes.js";

/* ===== PAYMENT ROUTES ===== */
import khaltiRoutes from "./routes/khaltiRoutes.js";
import esewaRoutes from "./routes/esewaRoutes.js";

/* ===== ADMIN ROUTES ===== */
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminWalletRoutes from "./routes/adminWalletRoutes.js";
import adminCouponRoutes from "./routes/adminCouponRoutes.js";
import adminSettingsRoutes from "./routes/adminSettingsRoutes.js";
import adminUploadRoutes from "./routes/adminUpload.js";
import adminRefreshRoutes from "./routes/adminRefresh.js";
import mediaRoutes from "./routes/mediaRoutes.js";

/* ✅ NEW: ADMIN USERS ROUTE */
import adminUserRoutes from "./routes/adminUserRoutes.js";

/* ===== PUBLIC COUPONS ===== */
import couponPublicRoutes from "./routes/couponPublicRoutes.js";

/* ================= MODELS ================= */
import Order from "./models/order.js";
import Settings from "./models/Settings.js";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= CONNECT DB ================= */
connectDB();

/* ================= CORS ================= */
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

/* =====================================================
   STRIPE WEBHOOK (MUST BE BEFORE express.json())
===================================================== */
app.post(
    "/api/stripe/webhook",
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
            console.error("❌ Stripe webhook signature error:", err.message);
            return res.status(400).send("Webhook Error");
        }

        try {
            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                const orderId = session.metadata?.orderId;

                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, {
                        paymentStatus: "paid",
                        orderStatus: "paid",
                        stripePaymentIntentId: session.payment_intent,
                    });
                }
            }

            res.json({ received: true });
        } catch (err) {
            console.error("❌ Stripe webhook handler error:", err);
            res.status(500).json({ error: "Webhook handler failed" });
        }
    }
);

/* ================= BODY PARSERS ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.resolve("uploads")));

/* ================= PUBLIC SETTINGS ================= */
app.get("/api/settings", async (_req, res) => {
    try {
        const settings = await Settings.getSingleton();

        res.json({
            codEnabled: settings.codEnabled,
            stripeEnabled: settings.stripeEnabled,
            esewaEnabled: settings.esewaEnabled,
            khaltiEnabled: settings.khaltiEnabled,
            shippingInsideValley: settings.shippingInsideValley,
            shippingOutsideValley: settings.shippingOutsideValley,
            maintenanceMode: settings.maintenanceMode,
        });
    } catch (err) {
        console.error("PUBLIC SETTINGS ERROR:", err);
        res.status(500).json({ error: "Failed to load settings" });
    }
});

/* ================= PUBLIC API ================= */
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/coupons", couponPublicRoutes);

/* ================= USER AUTH API ================= */
app.use("/api/auth", authRoutes);

/* ================= PAYMENT API ================= */
app.use("/api/payments/khalti", khaltiRoutes);
app.use("/api/payments/esewa", esewaRoutes);

/* ================= ADMIN API ================= */
app.use("/api/admin/refresh", adminRefreshRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/wallet", adminWalletRoutes);
app.use("/api/admin/coupons", adminCouponRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/admin/media", mediaRoutes);
app.use("/api/admin/upload", adminUploadRoutes);

/* ✅ NEW: ADMIN USERS ENDPOINT */
app.use("/api/admin/users", adminUserRoutes);

/* ================= HEALTH ================= */
app.get("/", (_req, res) => {
    res.send("Backend running ✅");
});

/* ================= ADMIN LOGIN ================= */
app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;

    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
        { role: "admin" },
        process.env.ADMIN_JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { role: "admin" },
        process.env.ADMIN_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ accessToken, refreshToken });
});

/* ================= STRIPE CHECKOUT ================= */
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { items, orderId } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.title },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cart",
            metadata: { orderId },
        });

        await Order.findByIdAndUpdate(orderId, {
            stripeSessionId: session.id,
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error("STRIPE SESSION ERROR:", err);
        res.status(500).json({ error: "Stripe session failed" });
    }
});

/* ================= START SERVER ================= */
app.listen(4242, () => {
    console.log("🚀 Backend running on http://localhost:4242");
});