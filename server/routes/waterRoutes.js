const express = require("express");

const {
    getWater,
    getWaterById,
    createWater,
    updateWater,
    deleteWater
} = require("../controllers/waterController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// VIEW WATER DATA
// ADMIN, CITY_OPERATOR, VIEWER
router.get("/", protect, getWater);

router.get("/:id", protect, getWaterById);


// CREATE WATER DATA
// ADMIN, CITY_OPERATOR only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    createWater
);


// UPDATE WATER DATA
// ADMIN, CITY_OPERATOR only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    updateWater
);


// DELETE WATER DATA
// ADMIN, CITY_OPERATOR only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    deleteWater
);


module.exports = router;