import express from "express";
import AdminSettings from "../models/AdminSettings.js";

const router = express.Router();

/* ===============================
   PUBLIC STORE SETTINGS
   (SAFE FOR CHECKOUT)
================================ */
router.get("/", async (_req, res) => {
    try {
        const settings = await AdminSettings.findOne();

        // default fallback
        res.json({
            payments: {
                codEnabled: settings?.payments?.codEnabled ?? true,
                stripeEnabled: settings?.payments?.stripeEnabled ?? true,
            },
            maintenanceMode: settings?.maintenanceMode ?? false,
        });
    } catch (err) {
        console.error("PUBLIC SETTINGS ERROR:", err);
        res.status(500).json({
            error: "Failed to load store settings",
        });
    }
});

export default router;