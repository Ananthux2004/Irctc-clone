const Booking = require("../models/Booking");
const Train = require("../models/Train");

// Function to generate PNR number
const generatePNR = async () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let pnr;
  let isUnique = false;

  while (!isUnique) {
    pnr = "";
    // Generate 10 character PNR
    for (let i = 0; i < 10; i++) {
      pnr += chars[Math.floor(Math.random() * chars.length)];
    }

    // Check if PNR already exists
    const existingBooking = await Booking.findOne({ pnrNumber: pnr });
    if (!existingBooking) {
      isUnique = true;
    }
  }
  return pnr;
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    console.log("Received booking data:", req.body);

    // Generate PNR number
    const pnrNumber = await generatePNR();

    // Create new booking with PNR
    const bookingData = {
      ...req.body,
      pnrNumber,
      seatClass: req.body.class || req.body.seatClass, // Handle both field names
      journey: req.body.journey || `${req.body.from} to ${req.body.to}`, // Handle both formats
    };

    // Remove any undefined fields
    Object.keys(bookingData).forEach(
      (key) => bookingData[key] === undefined && delete bookingData[key]
    );

    const booking = new Booking(bookingData);

    // Save the booking
    const savedBooking = await booking.save();
    console.log("Booking saved successfully:", savedBooking);

    // Generate a booking reference/ID (you can customize this format)
    const bookingId = savedBooking._id;

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      bookingId: bookingId,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

// Get booking by ID
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error retrieving booking",
      error: error.message,
    });
  }
};

// Get bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error retrieving user bookings",
      error: error.message,
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error cancelling booking",
      error: error.message,
    });
  }
};
