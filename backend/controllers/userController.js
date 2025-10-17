const User = require("../models/User");
const bcrypt = require("bcrypt");

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.session.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create admin user
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, adminKey, email, mobile, countryCode } =
      req.body;

    // Verify admin key
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ message: "Invalid admin key" });
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ isAdmin: true });
    if (adminExists) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid 10-digit mobile number" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = new User({
      username,
      password: hashedPassword,
      fullname: username, // Using username as fullname since it's required in the schema
      email,
      mobile,
      countryCode,
      isAdmin: true,
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin", error: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Check authentication status
exports.checkAuth = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(200).json({ isAuthenticated: false });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(200).json({ isAuthenticated: false });
    }

    res.status(200).json({
      isAuthenticated: true,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Set session data
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;

    // Return user data and redirect URL
    res.status(200).json({
      success: true,
      isAdmin: user.isAdmin,
      redirectUrl: user.isAdmin ? "/admin-dashboard.html" : "/index.html",
      message: "Login successful",
      redirectUrl: user.isAdmin ? "/admin-dashboard.html" : "/index.html",
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, fullname, password, email, mobile, countryCode } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      fullname,
      password: hashedPassword,
      email,
      mobile,
      countryCode,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};
