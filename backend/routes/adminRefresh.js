import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN TOKEN REFRESH
|--------------------------------------------------------------------------
| Generates a new access token using a valid refresh token
| Access token: 15 minutes
| Refresh token: 7 days (already issued at login)
|--------------------------------------------------------------------------
*/

router.post("/refresh", (req, res) => {
    const { refreshToken } = req.body;

    // ❌ No refresh token sent
    if (!refreshToken) {
        return res.status(401).json({
            error: "Refresh token missing",
        });
    }

    try {
        // 🔐 Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.ADMIN_REFRESH_SECRET
        );

        // ❌ Not an admin token
        if (decoded.role !== "admin") {
            return res.status(403).json({
                error: "Invalid refresh token",
            });
        }

        // ✅ Issue NEW access token
        const newAccessToken = jwt.sign(
            { role: "admin" },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: "15m" }
        );

        return res.json({
            accessToken: newAccessToken,
        });
    } catch (err) {
        return res.status(403).json({
            error: "Refresh token expired or invalid",
        });
    }
});

export default router;