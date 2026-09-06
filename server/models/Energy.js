const mongoose = require("mongoose");

const energySchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: true
        },

        consumption: {
            type: Number,
            default: 0
        },

        residential: {
            type: Number,
            default: 0
        },

        commercial: {
            type: Number,
            default: 0
        },

        industrial: {
            type: Number,
            default: 0
        },

        public: {
            type: Number,
            default: 0
        },

        renewablePercentage: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Energy", energySchema);
