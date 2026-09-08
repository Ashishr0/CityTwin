const express = require("express");

const {
    getEnvironment,
    getEnvironmentById,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment
} = require("../controllers/environmentController");

const router = express.Router();


// VIEW ENVIRONMENT DATA
router.get("/", getEnvironment);

router.get("/:id", getEnvironmentById);


// CREATE ENVIRONMENT DATA
router.post(
    "/",
createEnvironment
);


// UPDATE ENVIRONMENT DATA
router.put(
    "/:id",
updateEnvironment
);


// DELETE ENVIRONMENT DATA
router.delete(
    "/:id",
deleteEnvironment
);


module.exports = router;