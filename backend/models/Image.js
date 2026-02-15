import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },

        filename: {
            type: String,
            required: true,
        },

        size: {
            type: Number, // bytes
        },

        mimetype: {
            type: String,
        },

        usedIn: [
            {
                type: String, // hero, product, gallery, etc
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Image", imageSchema);