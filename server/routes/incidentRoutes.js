const express = require("express");

const {
    getIncidents,
    getIncidentById,
    createIncident,
    updateIncident,
    deleteIncident
} = require("../controllers/incidentController");

const router = express.Router();


// VIEW INCIDENTS
router.get("/", getIncidents);

router.get("/:id", getIncidentById);


// CREATE INCIDENT
router.post(
    "/",
createIncident
);


// UPDATE INCIDENT
router.put(
    "/:id",
updateIncident
);


// DELETE INCIDENT
router.delete(
    "/:id",
deleteIncident
);


module.exports = router;
