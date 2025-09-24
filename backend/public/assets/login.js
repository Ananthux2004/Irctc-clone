// Wait for the page to load
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  // Handle login form submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Basic validation
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    // Send login request
    fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Save user session data
          session.saveSession(data.user);
          // Redirect to index page
          window.location.href = "/index.html";
        } else {
          alert(data.message || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again.");
      });
  });

  // Add field validation
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // Username validation
  usernameInput.addEventListener("input", function () {
    const username = this.value.trim();
    if (username.length === 0) {
      this.classList.add("error");
      this.classList.remove("valid");
    } else {
      this.classList.add("valid");
      this.classList.remove("error");
    }
  });

  // Password validation
  passwordInput.addEventListener("input", function () {
    const password = this.value;
    if (password.length === 0) {
      this.classList.add("error");
      this.classList.remove("valid");
    } else {
      this.classList.add("valid");
      this.classList.remove("error");
    }
  });
});
