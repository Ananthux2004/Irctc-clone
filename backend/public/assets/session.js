// session.js - Utility functions for session management
const session = {
  // Check if user is logged in
  checkSession() {
    const user = this.getSession();
    return !!user;
  },

  // Get user data
  getUserData() {
    return this.getSession();
  },

  // Get session
  getSession() {
    try {
      const user = localStorage.getItem("user");
      const userData = user ? JSON.parse(user) : null;
      console.log("Retrieved session data:", userData);
      return userData;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  },
  // Save user session data
  saveSession(userData) {
    try {
      console.log("Saving session data:", userData);
      if (!userData || (!userData.userId && !userData.id)) {
        console.warn("Warning: Saving user data without ID:", userData);
      }
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("sessionStartTime", new Date().getTime());
      const savedData = this.getSession();
      console.log("Verified saved session data:", savedData);
    } catch (error) {
      console.error("Error saving session:", error);
    }
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
