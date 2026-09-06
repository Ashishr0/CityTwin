const Traffic = require("../models/Traffic");

// GET /api/traffic
const getTraffic = async (req, res) => {
    try {
        const traffic = await Traffic.find().sort({ createdAt: -1 });

        res.json(traffic);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch traffic data",
            error: error.message
        });
    }
};

// GET /api/traffic/:id
const getTrafficById = async (req, res) => {
    try {
        const traffic = await Traffic.findById(req.params.id);

        if (!traffic) {
            return res.status(404).json({
                message: "Traffic record not found"
            });
        }

        res.json(traffic);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch traffic record",
            error: error.message
        });
    }
};

// POST /api/traffic
const createTraffic = async (req, res) => {
    try {
        const traffic = await Traffic.create(req.body);

        res.status(201).json({
            message: "Traffic data created successfully",
            traffic
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create traffic data",
            error: error.message
        });
    }
};

// PUT /api/traffic/:id
const updateTraffic = async (req, res) => {
    try {
        const traffic = await Traffic.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!traffic) {
            return res.status(404).json({
                message: "Traffic record not found"
            });
        }

        res.json({
            message: "Traffic data updated successfully",
            traffic
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update traffic data",
            error: error.message
        });
    }
};

// DELETE /api/traffic/:id
const deleteTraffic = async (req, res) => {
    try {
        const traffic = await Traffic.findByIdAndDelete(
            req.params.id
        );

        if (!traffic) {
            return res.status(404).json({
                message: "Traffic record not found"
            });
        }

        res.json({
            message: "Traffic data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete traffic data",
            error: error.message
        });
    }
};

module.exports = {
    getTraffic,
    getTrafficById,
    createTraffic,
    updateTraffic,
    deleteTraffic
};
