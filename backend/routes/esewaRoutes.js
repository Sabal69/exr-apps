import express from "express";
import Order from "../models/order.js";

const router = express.Router();

/* ===============================
   eSewa VERIFY PAYMENT (REAL)
   Called from success redirect
================================ */
router.post("/verify", async (req, res) => {
    try {
        const { oid, amt, refId } = req.body;

        /* ================= VALIDATION ================= */
        if (!oid || !amt || !refId) {
            return res.status(400).json({
                error: "Missing verification parameters",
            });
        }

        /* ================= VERIFY WITH eSEWA ================= */
        const verifyUrl =
            "https://uat.esewa.com.np/epay/transrec";

        const params = new URLSearchParams({
            amt: String(amt),
            rid: String(refId),
            pid: String(oid),
            scd: process.env.ESEWA_MERCHANT_CODE, // EPAYTEST (uat)
        });

        const esewaRes = await fetch(verifyUrl, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });

        const text = await esewaRes.text();

        /* ================= CHECK RESPONSE ================= */
        if (
            !text ||
            !text.includes(
                "<response_code>Success</response_code>"
            )
        ) {
            console.error("eSewa verify failed:", text);
            return res.status(400).json({
                error: "eSewa payment verification failed",
            });
        }

        /* ================= UPDATE ORDER ================= */
        const order = await Order.findById(oid);

        if (!order) {
            return res.status(404).json({
                error: "Order not found",
            });
        }

        // Idempotency protection
        if (order.paymentStatus === "paid") {
            return res.json({
                success: true,
                message: "Order already verified",
            });
        }

        order.paymentStatus = "paid";
        order.orderStatus = "paid";
        order.esewaRefId = refId;

        await order.save();

        res.json({
            success: true,
            message: "eSewa payment verified successfully",
        });
    } catch (err) {
        console.error("❌ eSewa VERIFY ERROR:", err);
        res.status(500).json({
            error: "eSewa verification failed",
        });
    }
});

export default router;