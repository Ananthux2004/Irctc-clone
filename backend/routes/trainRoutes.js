const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trainController");
const { isAdmin } = require("../controllers/userController");

// Public routes
router.get("/all", trainController.getAllTrains);
router.get("/search", trainController.searchTrains);
router.get("/:id", trainController.getTrainById);

// Admin only routes
router.post("/add", isAdmin, trainController.addTrain);
router.put("/:id", isAdmin, trainController.updateTrain);
router.delete("/:id", isAdmin, trainController.deleteTrain);
router.post("/add", isAdmin, trainController.addTrain);
router.post("/schedule", isAdmin, trainController.updateSchedule);
router.delete("/:id", isAdmin, trainController.deleteTrain);

module.exports = router;
