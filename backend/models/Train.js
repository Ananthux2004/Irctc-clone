const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema({
  trainName: {
    type: String,
    required: true,
  },
  trainNumber: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  availableSeats: {
    sleeper: {
      type: Number,
      required: true,
      default: 100,
    },
    ac: {
      type: Number,
      required: true,
      default: 50,
    },
    general: {
      type: Number,
      required: true,
      default: 200,
    },
  },
  price: {
    sleeper: {
      type: Number,
      required: true,
    },
    ac: {
      type: Number,
      required: true,
    },
    general: {
      type: Number,
      required: true,
    },
  },
  daysOfOperation: [
    {
      type: String,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
  ],
});

const Train = mongoose.model("Train", trainSchema);

module.exports = Train;
