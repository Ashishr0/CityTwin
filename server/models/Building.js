const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
    {
        buildingId: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "RESIDENTIAL",
                "COMMERCIAL",
                "INDUSTRIAL",
                "HOSPITAL",
                "SCHOOL",
                "GOVERNMENT"
            ],
            required: true
        },

        floors: {
            type: Number,
            default: 1
        },

        occupancy: {
            type: Number,
            default: 0
        },

        energyConsumption: {
            type: Number,
            default: 0
        },

        waterConsumption: {
            type: Number,
            default: 0
        },

        location: {
            lat: Number,
            lng: Number
        },

        status: {
            type: String,
            enum: ["NORMAL", "WARNING", "CRITICAL"],
            default: "NORMAL"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Building", buildingSchema);
