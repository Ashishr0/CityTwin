const express = require("express");

const {
    getTraffic,
    getTrafficById,
    createTraffic,
    updateTraffic,
    deleteTraffic
} = require("../controllers/trafficController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// VIEW TRAFFIC
// ADMIN, CITY_OPERATOR, VIEWER
router.get("/", protect, getTraffic);

router.get("/:id", protect, getTrafficById);


// CREATE TRAFFIC
// ADMIN, CITY_OPERATOR only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    createTraffic
);


// UPDATE TRAFFIC
// ADMIN, CITY_OPERATOR only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    updateTraffic
);


// DELETE TRAFFIC
// ADMIN, CITY_OPERATOR only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    deleteTraffic
);


module.exports = router;