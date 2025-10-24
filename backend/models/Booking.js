const mongoose = require("mongoose");

// Remove all indexes first to start fresh
const bookingSchema = new mongoose.Schema({
  pnrNumber: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  trainId: {
    type: String,
    required: true,
  },
  journey: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  seatClass: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  baseFare: {
    type: Number,
    required: true,
  },
  gst: {
    type: Number,
    required: true,
  },
  convenienceFee: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "confirmed",
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

// Add compound index for efficient querying while allowing multiple bookings
bookingSchema.index({ userId: 1, date: 1, trainId: 1 });

// Add index for pnrNumber
bookingSchema.index({ pnrNumber: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
