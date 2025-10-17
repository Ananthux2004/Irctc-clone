// Wait for the page to load
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("loginForm element not found");
    return;
  }

  // Handle login form submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data (safely)
    const usernameEl = document.getElementById("username");
    const passwordEl = document.getElementById("password");

    if (!usernameEl || !passwordEl) {
      alert("Form elements missing. Please reload the page.");
      return;
    }

    const username = (usernameEl.value || "").trim();
    const password = passwordEl.value || "";

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
          // Save session data first (if session helper available)
          if (typeof session !== "undefined" && session.saveSession) {
            try {
              session.saveSession(data.user);
            } catch (e) {
              console.warn("Failed to save session locally", e);
            }
          }

          // Then redirect based on user role
          window.location.href = data.redirectUrl;
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

  // Add simple input validation handlers only if elements exist
  if (usernameInput) {
    usernameInput.addEventListener("input", function () {
      const username = (this.value || "").trim();
      if (username.length === 0) {
        this.classList.add("error");
        this.classList.remove("valid");
      } else {
        this.classList.add("valid");
        this.classList.remove("error");
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const password = this.value || "";
      if (password.length === 0) {
        this.classList.add("error");
        this.classList.remove("valid");
      } else {
        this.classList.add("valid");
        this.classList.remove("error");
      }
    });
  }
});
