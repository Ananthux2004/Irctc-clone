// session.js - Utility functions for session management

const session = {
  // Save user session data
  saveSession(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("sessionStartTime", new Date().getTime());
  },

  // Get current user session
  getSession() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get user ID from session
  getUserId() {
    const user = this.getSession();
    return user ? user.id : null;
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getSession();
  },

  // Clear session data
  clearSession() {
    localStorage.removeItem("user");
    localStorage.removeItem("sessionStartTime");
  },

  // Get session duration in minutes
  getSessionDuration() {
    const startTime = localStorage.getItem("sessionStartTime");
    if (!startTime) return 0;
    return Math.floor((new Date().getTime() - parseInt(startTime)) / 60000);
  },
};
