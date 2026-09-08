const express = require("express");

const {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
} = require("../controllers/buildingController");

const router = express.Router();


// VIEW BUILDINGS
router.get("/", getBuildings);

router.get("/:id", getBuildingById);


// CREATE BUILDING
router.post(
    "/",
createBuilding
);


// UPDATE BUILDING
router.put(
    "/:id",
updateBuilding
);


// DELETE BUILDING
router.delete(
    "/:id",
deleteBuilding
);


module.exports = router;
