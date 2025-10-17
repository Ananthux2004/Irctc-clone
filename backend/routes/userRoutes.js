const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  isAdmin,
  checkAuth,
  createAdmin,
} = require("../controllers/userController");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", checkAuth);
router.post("/create-admin", createAdmin);

// Admin routes
router.get("/all", isAdmin, getAllUsers);
router.delete("/:id", isAdmin, deleteUser);

module.exports = router;
