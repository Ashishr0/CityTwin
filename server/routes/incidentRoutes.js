const express = require("express");

const {
    getIncidents,
    getIncidentById,
    createIncident,
    updateIncident,
    deleteIncident
} = require("../controllers/incidentController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// VIEW INCIDENTS
// ADMIN, CITY_OPERATOR, VIEWER
router.get("/", protect, getIncidents);

router.get("/:id", protect, getIncidentById);


// CREATE INCIDENT
// ADMIN, CITY_OPERATOR only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    createIncident
);


// UPDATE INCIDENT
// ADMIN, CITY_OPERATOR only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    updateIncident
);


// DELETE INCIDENT
// ADMIN, CITY_OPERATOR only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    deleteIncident
);


module.exports = router;
