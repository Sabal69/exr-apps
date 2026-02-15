import express from "express";
import Homepage from "../models/Homepage.js";
import Product from "../models/Product.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ===============================
   ADMIN: LOAD DRAFT (EDITOR)
================================ */
router.get("/admin", adminAuth, async (_req, res) => {
    try {
        let homepage = await Homepage.findOne().lean();

        if (!homepage) {
            homepage = await Homepage.create({
                draftSections: [],
                publishedSections: [],
            });
        }

        const sections = await Promise.all(
            (homepage.draftSections || [])
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map(async section => {
                    // HERO → populate products
                    if (
                        section.type === "hero" &&
                        Array.isArray(section.data?.heroProducts)
                    ) {
                        const products = await Product.find({
                            _id: { $in: section.data.heroProducts },
                        }).lean();

                        return {
                            ...section,
                            data: {
                                ...section.data,
                                heroProducts: products,
                            },
                        };
                    }

                    return section;
                })
        );

        res.json({ sections });
    } catch (err) {
        console.error("❌ Admin load failed:", err);
        res.status(500).json({ error: "Admin homepage load failed" });
    }
});

/* ===============================
   PUBLIC: LOAD PUBLISHED
================================ */
router.get("/", async (_req, res) => {
    try {
        const homepage = await Homepage.findOne().lean();

        if (!homepage) {
            return res.json({ sections: [] });
        }

        const sections = await Promise.all(
            (homepage.publishedSections || [])
                .filter(section => section.enabled !== false) // ✅ IMPORTANT
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map(async section => {
                    // HERO → populate products
                    if (
                        section.type === "hero" &&
                        Array.isArray(section.data?.heroProducts)
                    ) {
                        const products = await Product.find({
                            _id: { $in: section.data.heroProducts },
                        }).lean();

                        return {
                            ...section,
                            data: {
                                ...section.data,
                                heroProducts: products,
                            },
                        };
                    }

                    return section;
                })
        );

        res.json({ sections });
    } catch (err) {
        console.error("❌ Public load failed:", err);
        res.status(500).json({ error: "Homepage load failed" });
    }
});

/* ===============================
   SAVE DRAFT (ADMIN)
================================ */
router.put("/", adminAuth, async (req, res) => {
    try {
        const { sections } = req.body;

        if (!Array.isArray(sections)) {
            return res.status(400).json({ error: "Invalid sections format" });
        }

        const cleanSections = sections.map((section, index) => ({
            _id: section._id,
            type: section.type,
            enabled: section.enabled !== false,
            order: index,
            data:
                section.type === "hero"
                    ? {
                        heroTitle: section.data?.heroTitle || "",
                        heroSubtitle: section.data?.heroSubtitle || "",
                        heroBackground:
                            section.data?.heroBackground || "",
                        heroButtonText:
                            section.data?.heroButtonText || "SHOP NOW",
                        heroButtonLink:
                            section.data?.heroButtonLink || "/products",
                        heroLayout:
                            section.data?.heroLayout || "classic",
                        heroProducts: Array.isArray(
                            section.data?.heroProducts
                        )
                            ? section.data.heroProducts.map(p =>
                                typeof p === "string" ? p : p?._id
                            )
                            : [],
                    }
                    : section.type === "contact"
                        ? {
                            title:
                                section.data?.title || "Contact Us",
                            subtitle:
                                section.data?.subtitle || "",
                            email:
                                section.data?.email || "",
                            phone:
                                section.data?.phone || "",
                            address:
                                section.data?.address || "",
                            instagram:
                                section.data?.instagram || "",
                            tiktok:
                                section.data?.tiktok || "",
                        }
                        : section.data || {},
        }));

        let homepage = await Homepage.findOne();

        if (!homepage) {
            homepage = new Homepage({
                draftSections: cleanSections,
                publishedSections: [],
            });
        } else {
            homepage.draftSections = cleanSections;
        }

        await homepage.save();
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Draft save failed:", err);
        res.status(500).json({ error: "Failed to save draft" });
    }
});

/* ===============================
   PUBLISH (ADMIN) ✅ FIXED
================================ */
router.post("/publish", adminAuth, async (_req, res) => {
    try {
        const homepage = await Homepage.findOne();

        if (!homepage) {
            return res.status(400).json({ error: "No homepage found" });
        }

        // ✅ SAFE COPY (NO toObject)
        homepage.publishedSections = (homepage.draftSections || []).map(
            (section, index) => ({
                ...section,
                order: index,
            })
        );

        await homepage.save();

        res.json({ success: true });
    } catch (err) {
        console.error("❌ Publish failed:", err);
        res.status(500).json({ error: "Publish failed" });
    }
});

export default router;