const Water = require("../models/Water");

// GET /api/water
const getWater = async (req, res) => {
    try {
        const data = await Water.find().sort({ createdAt: -1 });

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch water data",
            error: error.message
        });
    }
};

// GET /api/water/:id
const getWaterById = async (req, res) => {
    try {
        const data = await Water.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: "Water record not found"
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch water record",
            error: error.message
        });
    }
};

// POST /api/water
const createWater = async (req, res) => {
    try {
        const data = await Water.create(req.body);

        res.status(201).json({
            message: "Water data created successfully",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create water data",
            error: error.message
        });
    }
};

// PUT /api/water/:id
const updateWater = async (req, res) => {
    try {
        const data = await Water.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!data) {
            return res.status(404).json({
                message: "Water record not found"
            });
        }

        res.json({
            message: "Water data updated successfully",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update water data",
            error: error.message
        });
    }
};

// DELETE /api/water/:id
const deleteWater = async (req, res) => {
    try {
        const data = await Water.findByIdAndDelete(
            req.params.id
        );

        if (!data) {
            return res.status(404).json({
                message: "Water record not found"
            });
        }

        res.json({
            message: "Water data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete water data",
            error: error.message
        });
    }
};

module.exports = {
    getWater,
    getWaterById,
    createWater,
    updateWater,
    deleteWater
};
