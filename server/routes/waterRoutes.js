const express = require("express");

const {
    getWater,
    getWaterById,
    createWater,
    updateWater,
    deleteWater
} = require("../controllers/waterController");

const router = express.Router();


// VIEW WATER DATA
router.get("/", getWater);

router.get("/:id", getWaterById);


// CREATE WATER DATA
router.post(
    "/",
createWater
);


// UPDATE WATER DATA
router.put(
    "/:id",
updateWater
);


// DELETE WATER DATA
router.delete(
    "/:id",
deleteWater
);


module.exports = router;