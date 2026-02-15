import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["fixed", "percent"],
            required: true,
        },

        value: {
            type: Number,
            required: true,
            min: 0,
        },

        maxUses: {
            type: Number,
            default: null, // null = unlimited
            min: 1,
        },

        usedCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        expiresAt: {
            type: Date,
            default: null, // null = never expires
        },

        active: {
            type: Boolean,
            default: true,
        },

        note: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

/* ===============================
   VALIDATION HELPER
================================ */
couponSchema.methods.isValid = function () {
    if (!this.active) return false;

    if (this.expiresAt && this.expiresAt < new Date()) {
        return false;
    }

    if (this.maxUses !== null && this.usedCount >= this.maxUses) {
        return false;
    }

    return true;
};

export default mongoose.model("Coupon", couponSchema);