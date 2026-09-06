const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: String,
            required: true,
            unique: true
        },

        type: {
            type: String,
            enum: [
                "BUS",
                "AMBULANCE",
                "FIRE_TRUCK",
                "POLICE",
                "EV"
            ],
            required: true
        },

        route: {
            type: String
        },

        speed: {
            type: Number,
            default: 0
        },

        passengers: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "ON_ROUTE",
                "IDLE",
                "EMERGENCY",
                "OFFLINE"
            ],
            default: "IDLE"
        },

        location: {
            lat: Number,
            lng: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
