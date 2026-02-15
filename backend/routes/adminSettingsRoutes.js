import express from "express";
import Settings from "../models/Settings.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   GET SETTINGS
   - PUBLIC (checkout needs this)
================================ */
router.get("/", async (_req, res) => {
    try {
        const settings = await Settings.getSingleton();

        res.json(settings);
    } catch (err) {
        console.error("FETCH SETTINGS ERROR:", err);
        res.status(500).json({
            error: "Failed to load settings",
        });
    }
});

/* ===============================
   UPDATE SETTINGS (ADMIN ONLY)
================================ */
router.put("/", adminAuth, async (req, res) => {
    try {
        const settings = await Settings.getSingleton();

        const {
            storeEmail,
            codEnabled,
            stripeEnabled,
            esewaEnabled,
            khaltiEnabled,
            shippingInsideValley,
            shippingOutsideValley,
            freeShippingThreshold,
            maintenanceMode,
        } = req.body;

        /* ================= APPLY UPDATES ================= */
        if (typeof storeEmail === "string")
            settings.storeEmail = storeEmail.trim();

        if (typeof codEnabled === "boolean")
            settings.codEnabled = codEnabled;

        if (typeof stripeEnabled === "boolean")
            settings.stripeEnabled = stripeEnabled;

        if (typeof esewaEnabled === "boolean")
            settings.esewaEnabled = esewaEnabled;

        if (typeof khaltiEnabled === "boolean")
            settings.khaltiEnabled = khaltiEnabled;

        if (shippingInsideValley !== undefined)
            settings.shippingInsideValley = Number(shippingInsideValley);

        if (shippingOutsideValley !== undefined)
            settings.shippingOutsideValley = Number(shippingOutsideValley);

        if (freeShippingThreshold !== undefined)
            settings.freeShippingThreshold = Number(freeShippingThreshold);

        if (typeof maintenanceMode === "boolean")
            settings.maintenanceMode = maintenanceMode;

        await settings.save();

        res.json({
            success: true,
            settings,
        });
    } catch (err) {
        console.error("UPDATE SETTINGS ERROR:", err);
        res.status(500).json({
            error: "Failed to update settings",
        });
    }
});

export default router;