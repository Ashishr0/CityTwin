const express = require("express");

const {
    getWaste,
    getWasteById,
    createWaste,
    updateWaste,
    deleteWaste
} = require("../controllers/wasteController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// VIEW WASTE DATA
// ADMIN, CITY_OPERATOR, VIEWER
router.get("/", protect, getWaste);

router.get("/:id", protect, getWasteById);


// CREATE WASTE DATA
// ADMIN, CITY_OPERATOR only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    createWaste
);


// UPDATE WASTE DATA
// ADMIN, CITY_OPERATOR only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    updateWaste
);


// DELETE WASTE DATA
// ADMIN, CITY_OPERATOR only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "CITY_OPERATOR"),
    deleteWaste
);


module.exports = router;