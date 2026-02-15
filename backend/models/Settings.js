import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        /* ================= STORE INFO ================= */
        storeEmail: {
            type: String,
            default: "",
            trim: true,
        },

        /* ================= PAYMENT METHODS ================= */
        codEnabled: {
            type: Boolean,
            default: true,
        },

        stripeEnabled: {
            type: Boolean,
            default: true,
        },

        esewaEnabled: {
            type: Boolean,
            default: true,
        },

        khaltiEnabled: {
            type: Boolean,
            default: true,
        },

        /* ================= SHIPPING FEES ================= */
        shippingInsideValley: {
            type: Number,
            default: 150,
            min: 0,
        },

        shippingOutsideValley: {
            type: Number,
            default: 300,
            min: 0,
        },

        /* ================= FREE SHIPPING ================= */
        freeShippingThreshold: {
            type: Number,
            default: 10000,
            min: 0,
        },

        /* ================= MAINTENANCE ================= */
        maintenanceMode: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

/* ===============================
   SINGLETON SETTINGS DOCUMENT
   (ONLY ONE ROW IN DB)
================================ */
settingsSchema.statics.getSingleton = async function () {
    let settings = await this.findOne();

    if (!settings) {
        settings = await this.create({});
    }

    return settings;
};

export default mongoose.model("Settings", settingsSchema);