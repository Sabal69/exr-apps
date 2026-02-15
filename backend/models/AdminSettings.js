import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
    {
        payments: {
            codEnabled: {
                type: Boolean,
                default: true,
            },
            stripeEnabled: {
                type: Boolean,
                default: true,
            },
        },

        shipping: {
            flatFee: {
                type: Number,
                default: 0,
                min: 0,
            },
        },

        maintenanceMode: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("AdminSettings", adminSettingsSchema);