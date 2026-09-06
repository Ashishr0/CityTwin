const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: true
        },

        aqi: {
            type: Number,
            default: 0
        },



        pm25: {
            type: Number,
            default: 0
        },

        pm10: {
            type: Number,
            default: 0
        },

        co2: {
            type: Number,
            default: 0
        },

        temperature: {
            type: Number,
            default: 0
        },

        humidity: {
            type: Number,
            default: 0
        },

        noise: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Environment", environmentSchema);
