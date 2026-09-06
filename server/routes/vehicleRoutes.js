const express = require("express");

const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// VIEW VEHICLES
// ADMIN, CITY_OPERATOR, VIEWER
router.get("/", protect, getVehicles);

router.get("/:id", protect, getVehicleById);


// CREATE VEHICLE
// ADMIN, CITY_OPERATOR only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    createVehicle
);


// UPDATE VEHICLE
// ADMIN, CITY_OPERATOR only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    updateVehicle
);


// DELETE VEHICLE
// ADMIN, CITY_OPERATOR only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    deleteVehicle
);


module.exports = router;