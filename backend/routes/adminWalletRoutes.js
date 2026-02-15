import express from "express";
import AdminWallet from "../models/AdminWallet.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   GET ADMIN WALLET
================================ */
router.get("/", adminAuth, async (_req, res) => {
    try {
        let wallet = await AdminWallet.findOne();

        // auto-create wallet if not exists
        if (!wallet) {
            wallet = await AdminWallet.create({
                balance: 0,
                transactions: [],
            });
        }

        res.json(wallet);
    } catch (err) {
        console.error("Wallet fetch error:", err);
        res.status(500).json({
            error: "Failed to load wallet",
        });
    }
});

/* ===============================
   MANUAL WALLET ADJUSTMENT
   (ADMIN ONLY)
================================ */
router.post("/adjust", adminAuth, async (req, res) => {
    try {
        const { type, amount, note } = req.body;

        if (!["credit", "debit"].includes(type)) {
            return res.status(400).json({
                error: "Invalid transaction type",
            });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({
                error: "Invalid amount",
            });
        }

        let wallet = await AdminWallet.findOne();

        if (!wallet) {
            wallet = await AdminWallet.create({
                balance: 0,
                transactions: [],
            });
        }

        if (type === "debit" && wallet.balance < amount) {
            return res.status(400).json({
                error: "Insufficient wallet balance",
            });
        }

        // update balance
        wallet.balance =
            type === "credit"
                ? wallet.balance + amount
                : wallet.balance - amount;

        // record transaction
        wallet.transactions.unshift({
            type,
            amount,
            note: note || "Admin adjustment",
        });

        await wallet.save();

        res.json(wallet);
    } catch (err) {
        console.error("Wallet adjust error:", err);
        res.status(500).json({
            error: "Wallet update failed",
        });
    }
});

export default router;