const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBooking,
  getUserBookings,
  cancelBooking,
} = require("../controllers/bookingController");

// Create a new booking
router.post("/", createBooking);

// Get a specific booking by ID
router.get("/:id", getBooking);

// Get all bookings for a specific user
router.get("/user/:userId", getUserBookings);

// Cancel a booking
router.put("/:id/cancel", cancelBooking);

module.exports = router;
