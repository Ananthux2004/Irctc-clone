const Train = require("../models/Train");
const Schedule = require("../models/Schedule");

// Add a new train
exports.addTrain = async (req, res) => {
  try {
    const train = new Train(req.body);
    await train.save();
    res.status(201).json({ message: "Train added successfully", train });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding train", error: error.message });
  }
};

// Get all trains
exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.status(200).json(trains);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching trains", error: error.message });
  }
};

// Get a single train by ID
exports.getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.status(200).json(train);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching train", error: error.message });
  }
};

// Update a train
exports.updateTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.status(200).json({ message: "Train updated successfully", train });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating train", error: error.message });
  }
};

// Delete a train
exports.deleteTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndDelete(req.params.id);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.status(200).json({ message: "Train deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting train", error: error.message });
  }
};

// Search trains
exports.searchTrains = async (req, res) => {
  try {
    const { from, to, date, class: classType } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        message: "Source and destination stations are required"
      });
    }

    console.log('Searching trains with params:', { from, to, date, classType });

    // Create base query
    let query = {
      source: { $regex: from, $options: "i" },
      destination: { $regex: to, $options: "i" }
    };

    // Find matching trains - removing populate for now to simplify query
    let trains = await Train.find(query);

    // Filter by date and day of week
    if (date) {
      const searchDate = new Date(date);
      const dayOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][searchDate.getDay()];

      trains = trains.filter(
        (train) =>
          train.daysOfOperation && train.daysOfOperation.includes(dayOfWeek)
      );
    }

    // Format response with additional details
    const formattedTrains = trains.map((train) => ({
      id: train._id,
      number: train.trainNumber,
      name: train.name,
      source: train.source,
      destination: train.destination,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: calculateDuration(train.departureTime, train.arrivalTime),
      distance: train.distance || 0,
      runningDays: train.daysOfOperation || [],
      status: train.status || "Available",
      fareDetails: {
        "1A": train.fare ? train.fare * 4 : 2000,
        "2A": train.fare ? train.fare * 3 : 1500,
        "3A": train.fare ? train.fare * 2 : 1000,
        SL: train.fare || 500,
      },
    }));

    res.status(200).json(formattedTrains);
    const schedules = await Promise.all(
      trains.map(async (train) => {
        const schedule = await Schedule.findOne({
          trainId: train._id,
          date: {
            $gte: new Date(searchDate.setHours(0, 0, 0)),
            $lt: new Date(searchDate.setHours(23, 59, 59)),
          },
        });

        return {
          ...train.toObject(),
          availableSeats: schedule ? schedule.seats : train.availableSeats,
        };
      })
    );

    res.status(200).json(schedules);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching trains", error: error.message });
  }
};

// Create or update schedule for a train
exports.updateSchedule = async (req, res) => {
  try {
    const { trainId, date, seats } = req.body;

    const schedule = await Schedule.findOneAndUpdate(
      { trainId, date },
      { seats },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({ message: "Schedule updated successfully", schedule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating schedule", error: error.message });
  }
};

// Delete a train
exports.deleteTrain = async (req, res) => {
  try {
    const trainId = req.params.id;

    // Delete the train
    const train = await Train.findByIdAndDelete(trainId);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    // Delete all schedules associated with this train
    await Schedule.deleteMany({ trainId });

    res
      .status(200)
      .json({ message: "Train and associated schedules deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting train", error: error.message });
  }
};
