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

// Helper function to calculate duration between two time strings
const calculateDuration = (departureTime, arrivalTime) => {
  const [depHours, depMinutes] = departureTime.split(":").map(Number);
  const [arrHours, arrMinutes] = arrivalTime.split(":").map(Number);

  let hours = arrHours - depHours;
  let minutes = arrMinutes - depMinutes;

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  if (hours < 0) {
    hours += 24;
  }

  return `${hours}h ${minutes}m`;
};

// Search trains
exports.searchTrains = async (req, res) => {
  try {
    const { from, to, date, class: classType } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        message: "Source and destination stations are required",
      });
    }

    console.log("Searching trains with params:", { from, to, date, classType });

    // Create base query
    let query = {
      source: { $regex: from, $options: "i" },
      destination: { $regex: to, $options: "i" },
    };

    // Find matching trains
    let trains = await Train.find(query);

    // Filter by date and day of week if date is provided
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

      // Get schedules for the filtered trains
      const schedules = await Schedule.find({
        trainId: { $in: trains.map((train) => train._id) },
        date: {
          $gte: new Date(searchDate.setHours(0, 0, 0)),
          $lt: new Date(searchDate.setHours(23, 59, 59)),
        },
      });

      // Create a map of schedules by trainId
      const scheduleMap = new Map(
        schedules.map((schedule) => [schedule.trainId.toString(), schedule])
      );

      // Format response with additional details and schedule information
      const formattedTrains = trains.map((train) => {
        const schedule = scheduleMap.get(train._id.toString());
        return {
          id: train._id,
          number: train.trainNumber,
          name: train.trainName,
          source: train.source,
          destination: train.destination,
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
          duration: calculateDuration(train.departureTime, train.arrivalTime),
          runningDays: train.daysOfOperation || [],
          status: "Available",
          fareDetails: {
            AC: train.price.ac,
            Sleeper: train.price.sleeper,
            General: train.price.general,
          },
          availableSeats: schedule ? schedule.seats : train.availableSeats,
        };
      });

      return res.status(200).json(formattedTrains);
    }

    // If no date provided, just return the basic train information
    const formattedTrains = trains.map((train) => ({
      id: train._id,
      number: train.trainNumber,
      name: train.trainName,
      source: train.source,
      destination: train.destination,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: calculateDuration(train.departureTime, train.arrivalTime),
      runningDays: train.daysOfOperation || [],
      status: "Available",
      fareDetails: {
        AC: train.price.ac,
        Sleeper: train.price.sleeper,
        General: train.price.general,
      },
      availableSeats: train.availableSeats,
    }));

    res.status(200).json(formattedTrains);
  } catch (error) {
    console.error("Search trains error:", error);
    res.status(500).json({
      message: "Error searching trains",
      error: error.message,
    });
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
