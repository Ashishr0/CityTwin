const Waste = require("../models/Waste");

// GET /api/waste
const getWaste = async (req, res) => {
    try {
        const data = await Waste.find().sort({ createdAt: -1 });

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch waste data",
            error: error.message
        });
    }
};

// GET /api/waste/:id
const getWasteById = async (req, res) => {
    try {
        const data = await Waste.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: "Waste record not found"
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch waste record",
            error: error.message
        });
    }
};

// POST /api/waste
const createWaste = async (req, res) => {
    try {
        const data = await Waste.create(req.body);

        res.status(201).json({
            message: "Waste data created successfully",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create waste data",
            error: error.message
        });
    }
};

// PUT /api/waste/:id
const updateWaste = async (req, res) => {
    try {
        const data = await Waste.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!data) {
            return res.status(404).json({
                message: "Waste record not found"
            });
        }

        res.json({
            message: "Waste data updated successfully",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update waste data",
            error: error.message
        });
    }
};

// DELETE /api/waste/:id
const deleteWaste = async (req, res) => {
    try {
        const data = await Waste.findByIdAndDelete(
            req.params.id
        );

        if (!data) {
            return res.status(404).json({
                message: "Waste record not found"
            });
        }

        res.json({
            message: "Waste data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete waste data",
            error: error.message
        });
    }
};

module.exports = {
    getWaste,
    getWasteById,
    createWaste,
    updateWaste,
    deleteWaste
};
