const express = require("express");

const {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
} = require("../controllers/buildingController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// VIEW BUILDINGS
// ADMIN, CITY_OPERATOR, VIEWER
router.get("/", protect, getBuildings);

router.get("/:id", protect, getBuildingById);


// CREATE BUILDING
// ADMIN, CITY_OPERATOR only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    createBuilding
);


// UPDATE BUILDING
// ADMIN, CITY_OPERATOR only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    updateBuilding
);


// DELETE BUILDING
// ADMIN, CITY_OPERATOR only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    deleteBuilding
);


module.exports = router;
