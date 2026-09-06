const Incident = require("../models/Incident");

// GET /api/incidents
const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 });

        res.json(incidents);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch incidents",
            error: error.message
        });
    }
};

// GET /api/incidents/:id
const getIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({
                message: "Incident not found"
            });
        }

        res.json(incident);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch incident",
            error: error.message
        });
    }
};

// POST /api/incidents
const createIncident = async (req, res) => {
    try {
        const incident = await Incident.create(req.body);

        res.status(201).json({
            message: "Incident created successfully",
            incident
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create incident",
            error: error.message
        });
    }
};

// PUT /api/incidents/:id
const updateIncident = async (req, res) => {
    try {
        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!incident) {
            return res.status(404).json({
                message: "Incident not found"
            });
        }

        res.json({
            message: "Incident updated successfully",
            incident
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update incident",
            error: error.message
        });
    }
};

// DELETE /api/incidents/:id
const deleteIncident = async (req, res) => {
    try {
        const incident = await Incident.findByIdAndDelete(
            req.params.id
        );

        if (!incident) {
            return res.status(404).json({
                message: "Incident not found"
            });
        }

        res.json({
            message: "Incident deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete incident",
            error: error.message
        });
    }
};

module.exports = {
    getIncidents,
    getIncidentById,
    createIncident,
    updateIncident,
    deleteIncident
};
