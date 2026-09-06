const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema(
    {
        intersectionId: {
            type: String,
            required: true
        },

        location: {
            lat: Number,
            lng: Number
        },

        vehicles: {
            type: Number,
            default: 0
        },

        congestion: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        averageSpeed: {
            type: Number,
            default: 0
        },

        averageWaitTime: {
            type: Number,
            default: 0
        },

        signalStatus: {
            type: String,
            enum: ["ACTIVE", "INACTIVE", "MAINTENANCE"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Traffic", trafficSchema);
