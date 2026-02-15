import express from "express";
import nodemailer from "nodemailer";
import Homepage from "../models/Homepage.js";

const router = express.Router();

/* ===============================
   GET /api/contact
   (PUBLIC — READ FROM PUBLISHED)
================================ */
router.get("/", async (_req, res) => {
    try {
        const homepage = await Homepage.findOne().lean();

        if (!homepage || !Array.isArray(homepage.publishedSections)) {
            return res.status(404).json({
                error: "Contact not available",
            });
        }

        const contactSection = homepage.publishedSections.find(
            s => s.type === "contact" && s.enabled !== false
        );

        if (!contactSection) {
            return res.status(404).json({
                error: "Contact not available",
            });
        }

        // ✅ Frontend expects ONLY data
        res.json(contactSection.data);
    } catch (err) {
        console.error("❌ Failed to load contact:", err);
        res.status(500).json({
            error: "Failed to load contact",
        });
    }
});

/* ===============================
   POST /api/contact
   (SEND EMAIL — GMAIL APP PASSWORD)
================================ */
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // ✅ Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        // ✅ Env validation
        if (
            !process.env.CONTACT_EMAIL ||
            !process.env.CONTACT_EMAIL_PASSWORD
        ) {
            console.error("❌ Missing CONTACT_EMAIL or CONTACT_EMAIL_PASSWORD");
            return res.status(500).json({
                error: "Email service not configured",
            });
        }

        console.log("📧 Sending contact email as:", process.env.CONTACT_EMAIL);

        /* ===============================
           GMAIL (APP PASSWORD)
        ================================ */
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.CONTACT_EMAIL,
                pass: process.env.CONTACT_EMAIL_PASSWORD, // 16-char app password
            },
        });

        // ✅ Verify SMTP connection (important)
        await transporter.verify();

        /* ===============================
           SEND EMAIL
        ================================ */
        await transporter.sendMail({
            from: `"EXR Contact" <${process.env.CONTACT_EMAIL}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `New Contact Message from ${name}`,
            text: `
Name: ${name}
Email: ${email}

Message:
${message}
            `,
        });

        res.json({ success: true });
    } catch (err) {
        console.error("❌ Contact send failed:", err);
        res.status(500).json({
            error: "Failed to send message",
        });
    }
});

export default router;