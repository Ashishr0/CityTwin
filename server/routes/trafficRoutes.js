const express = require("express");

const {
    getTraffic,
    getTrafficById,
    createTraffic,
    updateTraffic,
    deleteTraffic
} = require("../controllers/trafficController");

const router = express.Router();


// VIEW TRAFFIC
router.get("/", getTraffic);

router.get("/:id", getTrafficById);


// CREATE TRAFFIC
router.post(
    "/",
createTraffic
);


// UPDATE TRAFFIC
router.put(
    "/:id",
updateTraffic
);


// DELETE TRAFFIC
router.delete(
    "/:id",
deleteTraffic
);


module.exports = router;