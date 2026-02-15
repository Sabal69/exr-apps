import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

// Load environment variables from .env
dotenv.config();
console.log('Stripe key loaded:', process.env.STRIPE_SECRET_KEY);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("Stripe server running ✅");
});

// Stripe Checkout endpoint
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No items provided" });
        }

        const lineItems = items.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cart",
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});