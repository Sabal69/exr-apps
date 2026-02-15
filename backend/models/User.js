import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        /* ===============================
           BASIC INFO
        ================================ */
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        /* ===============================
           WALLET (REFUND CREDIT SYSTEM)
        ================================ */
        walletBalance: {
            type: Number,
            default: 0,
            min: 0,
        },

        walletTransactions: [
            {
                type: {
                    type: String,
                    enum: ["refund", "admin_credit", "purchase"],
                },
                amount: Number,
                note: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        /* ===============================
           WISHLIST (REAL WORKING)
        ================================ */
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        /* ===============================
           COUPONS OWNED BY USER
        ================================ */
        coupons: [
            {
                code: String,
                discount: Number,
                expiresAt: Date,
                isUsed: {
                    type: Boolean,
                    default: false,
                },
            },
        ],

        /* ===============================
           ACCOUNT CONTROL
        ================================ */
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);