const express = require("express");

const {
    getWaste,
    getWasteById,
    createWaste,
    updateWaste,
    deleteWaste
} = require("../controllers/wasteController");

const router = express.Router();


// VIEW WASTE DATA
router.get("/", getWaste);

router.get("/:id", getWasteById);


// CREATE WASTE DATA
router.post(
    "/",
createWaste
);


// UPDATE WASTE DATA
router.put(
    "/:id",
updateWaste
);


// DELETE WASTE DATA
router.delete(
    "/:id",
deleteWaste
);


module.exports = router;