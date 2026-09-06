const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: true
        },

        reservoirLevel: {
            type: Number,

   default: 0
        },

        dailyConsumption: {
            type: Number,
            default: 0
        },

        pipelinePressure: {
            type: Number,
            default: 0
        },

        leakageDetected: {
            type: Boolean,
            default: false
        },

        treatmentPlantStatus: {
            type: String,
            enum: ["OPERATIONAL", "WARNING", "OFFLINE"],
            default: "OPERATIONAL"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Water", waterSchema);
