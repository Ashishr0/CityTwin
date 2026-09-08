const express = require("express");

const {
    getEnergy,
    getEnergyById,
    createEnergy,
    updateEnergy,
    deleteEnergy
} = require("../controllers/energyController");

const router = express.Router();


// VIEW ENERGY DATA
router.get("/", getEnergy);

router.get("/:id", getEnergyById);


// CREATE ENERGY DATA
router.post(
    "/",
createEnergy
);


// UPDATE ENERGY DATA
router.put(
    "/:id",
updateEnergy
);


// DELETE ENERGY DATA
router.delete(
    "/:id",
deleteEnergy
);


module.exports = router;