const Environment = require("../models/Environment");

// GET /api/environment
const getEnvironment = async (req, res) => {
    try {
        const data = await Environment.find().sort({ createdAt: -1 });

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch environment data",
            error: error.message
        });
    }
};

// GET /api/environment/:id
const getEnvironmentById = async (req, res) => {
    try {
        const data = await Environment.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: "Environment record not found"
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch environment record",
            error: error.message
        });
    }
};

// POST /api/environment
const createEnvironment = async (req, res) => {
    try {
        const data = await Environment.create(req.body);

        res.status(201).json({
            message: "Environment data created successfully",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create environment data",
            error: error.message
        });
    }
};

// PUT /api/environment/:id
const updateEnvironment = async (req, res) => {
    try {
        const data = await Environment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!data) {
            return res.status(404).json({
                message: "Environment record not found"
            });
        }

        res.json({
            message: "Environment data updated successfully",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update environment data",
            error: error.message
        });
    }
};

// DELETE /api/environment/:id
const deleteEnvironment = async (req, res) => {
    try {
        const data = await Environment.findByIdAndDelete(
            req.params.id
        );

        if (!data) {
            return res.status(404).json({
                message: "Environment record not found"
            });
        }

        res.json({
            message: "Environment data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete environment data",
            error: error.message
        });
    }
};

module.exports = {
    getEnvironment,
    getEnvironmentById,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment
};
