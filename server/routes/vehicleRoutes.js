const express = require("express");

const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleController");

const router = express.Router();


// VIEW VEHICLES
router.get("/", getVehicles);

router.get("/:id", getVehicleById);


// CREATE VEHICLE
router.post(
    "/",
createVehicle
);


// UPDATE VEHICLE
router.put(
    "/:id",
updateVehicle
);


// DELETE VEHICLE
router.delete(
    "/:id",
deleteVehicle
);


module.exports = router;