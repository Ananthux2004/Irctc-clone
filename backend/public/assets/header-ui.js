// Function to update header based on session state
function updateHeaderUI() {
  const loginLink = document.getElementById("loginLink");
  const userInfo = document.getElementById("userInfo");
  const userSpan = document.getElementById("username");

  // Get current user data
  const userData = session.getUserData();

  if (userData && userData.username) {
    // User is logged in
    if (loginLink) loginLink.style.display = "none";
    if (userInfo) {
      userInfo.style.display = "inline-block";
      if (userSpan) userSpan.textContent = userData.username;
    }
  } else {
    // User is not logged in
    if (loginLink) loginLink.style.display = "inline-block";
    if (userInfo) userInfo.style.display = "none";
  }
}

// Add logout handler
function setupLogoutHandler() {
  const userInfo = document.getElementById("userInfo");
  if (userInfo) {
    userInfo.addEventListener("click", () => {
      // Clear the session
      session.clearSession();
      // Redirect to home page
      window.location.href = "/";
    });
  }
}

// Call these functions when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderUI();
  setupLogoutHandler();
});

// Export these functions for use in other files
window.headerUI = {
  update: updateHeaderUI,
  setupLogout: setupLogoutHandler,
};
