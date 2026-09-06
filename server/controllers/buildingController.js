const Building = require("../models/Building");

// GET /api/buildings
const getBuildings = async (req, res) => {
    try {
        const buildings = await Building.find().sort({ createdAt: -1 });

        res.json(buildings);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch buildings",
            error: error.message
        });
    }
};

// GET /api/buildings/:id
const getBuildingById = async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);

        if (!building) {
            return res.status(404).json({
                message: "Building not found"
            });
        }

        res.json(building);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch building",
            error: error.message
        });
    }
};

// POST /api/buildings
const createBuilding = async (req, res) => {
    try {
        const building = await Building.create(req.body);

        res.status(201).json({
            message: "Building created successfully",
            building
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create building",
            error: error.message
        });
    }
};

// PUT /api/buildings/:id
const updateBuilding = async (req, res) => {
    try {
        const building = await Building.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!building) {
            return res.status(404).json({
                message: "Building not found"
            });
        }

        res.json({
            message: "Building updated successfully",
            building
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update building",
            error: error.message
        });
    }
};

// DELETE /api/buildings/:id
const deleteBuilding = async (req, res) => {
    try {
        const building = await Building.findByIdAndDelete(
            req.params.id
        );

        if (!building) {
            return res.status(404).json({
                message: "Building not found"
            });
        }

        res.json({
            message: "Building deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete building",
            error: error.message
        });
    }
};

module.exports = {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
};
