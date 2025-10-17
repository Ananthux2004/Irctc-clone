require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/IRCTC");
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const adminExists = await User.findOne({ isAdmin: true });
    if (adminExists) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Admin user details
    const adminUser = {
      username: "admin",
      password: "admin123", // This will be hashed
      email: "admin@irctc.com",
      mobile: "9999999999",
      countryCode: "+91",
      fullname: "Admin User",
      isAdmin: true,
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);

    // Create the admin user
    const admin = new User({
      ...adminUser,
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Username:", adminUser.username);
    console.log("Password:", adminUser.password);
    console.log("Please save these credentials securely.");
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the function
createAdminUser();
