import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        /* ===============================
           USER (SAFE FOR GUEST + LOGIN)
        ================================ */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null, // allows guest checkout
        },

        /* ===============================
           ORDER ITEMS
        ================================ */
        items: [
            {
                _id: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                image: String,
            },
        ],

        /* ===============================
           SHIPPING INFO
        ================================ */
        shipping: {
            fullName: String,
            phone: String,
            address: String,
            city: String,
            province: String,
            notes: String,
        },

        /* ===============================
           TOTAL
        ================================ */
        totalAmount: {
            type: Number,
            required: true,
        },

        /* ===============================
           PAYMENT METHOD
        ================================ */
        paymentMethod: {
            type: String,
            enum: ["stripe", "cod", "esewa", "khalti"],
            required: true,
        },

        /* ===============================
           PAYMENT STATUS
        ================================ */
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        /* ===============================
           ORDER STATUS
        ================================ */
        orderStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        /* ===============================
           STRIPE META
        ================================ */
        stripeSessionId: {
            type: String,
            default: null,
        },

        stripePaymentIntentId: {
            type: String,
            default: null,
        },

        /* ===============================
           COUPON META
        ================================ */
        coupon: {
            code: String,
            type: String,
            value: Number,
            discount: Number,
        },

        /* ===============================
           REFUND & RETURN META
        ================================ */
        refundRequested: {
            type: Boolean,
            default: false,
        },

        refundRequestedAt: {
            type: Date,
            default: null,
        },

        refundReason: {
            type: String,
            enum: [
                "change_of_mind",
                "size_issue",
                "damaged_item",
                "wrong_item",
            ],
            default: null,
        },

        refundStatus: {
            type: String,
            enum: ["none", "requested", "approved", "rejected", "refunded"],
            default: "none",
        },

        refundMethod: {
            type: String,
            enum: ["wallet", "original_payment", null],
            default: null,
        },

        refundAmount: {
            type: Number,
            default: 0,
        },

        refundedAt: {
            type: Date,
            default: null,
        },

        refundedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema);