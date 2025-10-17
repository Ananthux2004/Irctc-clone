const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  seats: {
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
});

// Create a compound index to ensure unique combination of trainId and date
scheduleSchema.index({ trainId: 1, date: 1 }, { unique: true });

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
