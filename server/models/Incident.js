const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                "ACCIDENT",
                "FIRE",
                "WATER_LEAK",
                "POWER_OUTAGE",
                "POLLUTION",
                "OTHER"
            ],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        priority: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ],
            default: "MEDIUM"
        },

        location: {
            lat: Number,
            lng: Number
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "IN_PROGRESS",
                "RESOLVED"
            ],
            default: "ACTIVE"
        },

       reportedBy: {
    type: String
}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Incident", incidentSchema);
