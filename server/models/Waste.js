const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema(
    {
        binId: {
            type: String,
            required: true,
            unique: true
        },

        location: {
            lat: Number,
            lng: Number
        },

        fillLevel: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "EMPTY",
                "NORMAL",
                "ALMOST_FULL",
                "CRITICAL"
            ],
            default: "EMPTY"
        },

        lastCollected: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Waste", wasteSchema);
