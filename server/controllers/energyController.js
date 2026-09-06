const Energy = require("../models/Energy");

// GET /api/energy
const getEnergy = async (req, res) => {
    try {
        const data = await Energy.find().sort({ createdAt: -1 });

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch energy data",
            error: error.message
        });
    }
};

// GET /api/energy/:id
const getEnergyById = async (req, res) => {
    try {
        const data = await Energy.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: "Energy record not found"
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch energy record",
            error: error.message
        });
    }
};

// POST /api/energy
const createEnergy = async (req, res) => {
    try {
        const data = await Energy.create(req.body);

        res.status(201).json({
            message: "Energy data created successfully",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create energy data",
            error: error.message
        });
    }
};

// PUT /api/energy/:id
const updateEnergy = async (req, res) => {
    try {
        const data = await Energy.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!data) {
            return res.status(404).json({
                message: "Energy record not found"
            });
        }

        res.json({
            message: "Energy data updated successfully",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update energy data",
            error: error.message
        });
    }
};

// DELETE /api/energy/:id
const deleteEnergy = async (req, res) => {
    try {
        const data = await Energy.findByIdAndDelete(
            req.params.id
        );

        if (!data) {
            return res.status(404).json({
                message: "Energy record not found"
            });
        }

        res.json({
            message: "Energy data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete energy data",
            error: error.message
        });
    }
};

module.exports = {
    getEnergy,
    getEnergyById,
    createEnergy,
    updateEnergy,
    deleteEnergy
};
