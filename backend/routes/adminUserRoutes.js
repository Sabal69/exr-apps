import express from "express";
import User from "../models/user.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===================================================
   GET ALL USERS (ADMIN ONLY)
   GET /api/admin/users
=================================================== */
router.get("/", adminAuth, async (_req, res) => {
    try {
        const users = await User.find()
            .select("-password") // never send password
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users,
        });
    } catch (err) {
        console.error("FETCH USERS ERROR:", err);
        res.status(500).json({
            error: "Failed to fetch users",
        });
    }
});

/* ===================================================
   TOGGLE USER ACTIVE / BLOCK
   PATCH /api/admin/users/:id/toggle
=================================================== */
router.patch("/:id/toggle", adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            isActive: user.isActive,
        });
    } catch (err) {
        console.error("TOGGLE USER ERROR:", err);
        res.status(500).json({
            error: "Failed to update user",
        });
    }
});

export default router;