const express = require("express");

const {
    getEnvironment,
    getEnvironmentById,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment
} = require("../controllers/environmentController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// VIEW ENVIRONMENT DATA
// ADMIN, CITY_OPERATOR, VIEWER
router.get("/", protect, getEnvironment);

router.get("/:id", protect, getEnvironmentById);


// CREATE ENVIRONMENT DATA
// ADMIN, CITY_OPERATOR only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    createEnvironment
);


// UPDATE ENVIRONMENT DATA
// ADMIN, CITY_OPERATOR only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    updateEnvironment
);


// DELETE ENVIRONMENT DATA
// ADMIN, CITY_OPERATOR only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    deleteEnvironment
);


module.exports = router;