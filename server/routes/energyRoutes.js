const express = require("express");

const {
    getEnergy,
    getEnergyById,
    createEnergy,
    updateEnergy,
    deleteEnergy
} = require("../controllers/energyController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// VIEW ENERGY DATA
// ADMIN, CITY_OPERATOR, VIEWER
router.get("/", protect, getEnergy);

router.get("/:id", protect, getEnergyById);


// CREATE ENERGY DATA
// ADMIN, CITY_OPERATOR only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    createEnergy
);


// UPDATE ENERGY DATA
// ADMIN, CITY_OPERATOR only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    updateEnergy
);


// DELETE ENERGY DATA
// ADMIN, CITY_OPERATOR only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    deleteEnergy
);


module.exports = router;