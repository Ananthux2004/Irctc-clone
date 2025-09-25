// Wait for the page to load
document.addEventListener("DOMContentLoaded", function () {
  // Get form elements
  const registerForm = document.getElementById("registerForm");

  // Side Menu Elements
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuMains = document.querySelectorAll(".menu-main[data-menu]");

  // Notification button
  const notificationBtn = document.getElementById("notificationBtn");

  // Declare all inputs and error elements at the top
  const usernameInput = document.getElementById("username");
  const fullnameInput = document.getElementById("fullname");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const emailInput = document.getElementById("email");
  const mobileInput = document.getElementById("mobile");

  const usernameError = document.getElementById("username-error");
  const fullnameError = document.getElementById("fullname-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error"
  );
  const emailError = document.getElementById("email-error");
  const mobileError = document.getElementById("mobile-error");
  const passwordStrength = document.getElementById("password-strength");

  // Handle register form submission
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    console.log("Submit event triggered");
    // Run all validations on submit
    validateAllFields();

    // Get form data
    const username = usernameInput.value.trim();
    const fullname = fullnameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const email = emailInput.value.trim();
    const mobile = mobileInput.value.trim();

    // Check if there are any validation errors
    const errorElements = Array.from(
      document.querySelectorAll(".error-message")
    );
    const hasErrors = errorElements.some((error) => error.textContent !== "");
    if (hasErrors) {
      const errorMessages = errorElements
        .filter((error) => error.textContent !== "")
        .map((error) => error.textContent);
      console.log("Validation errors:", errorMessages);
    }

    // Check for empty fields
    const hasEmptyFields =
      !username ||
      !fullname ||
      !password ||
      !confirmPassword ||
      !email ||
      !mobile;

    if (hasEmptyFields) {
      console.log("Validation failed: empty fields");
      alert("Please fill in all fields");
      return;
    }

    if (hasErrors) {
      console.log("Validation failed: errors present");
      alert("Please fix all validation errors before submitting");
      return;
    }

    // Create user data object
    const userData = {
      username,
      fullname,
      password,
      email,
      mobile,
      countryCode: "+91", // Adding default country code for India
    };

    // Send registration request
    fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Show success message
          alert("Registration successful! Please login.");
          // Clear form and reset validation
          registerForm.reset();
          document
            .querySelectorAll(".error-message")
            .forEach((error) => error.classList.remove("show"));
          document.querySelectorAll("input").forEach((input) => {
            input.classList.remove("error", "valid");
          });
          passwordStrength.textContent = "";
          // Redirect to login page
          window.location.href = "/login.html";
        } else {
          // Show error message
          alert(data.message || "Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        alert("An error occurred during registration. Please try again.");
      });
  });

  // Function to run all validations on submit
  function validateAllFields() {
    console.log("validateAllFields called");
    // Call validation functions directly to ensure error messages show
    validateUsername();
    validateFullname();
    validatePasswordField();
    validateConfirmPassword();
    validateEmail();
    validateMobile();
  }

  function validateUsername() {
    const username = usernameInput.value.trim();
    if (username.length === 0) {
      showError(
        usernameInput,
        usernameError,
        "User Name/Email Id is required."
      );
    } else if (username.length < 7) {
      showError(
        usernameInput,
        usernameError,
        "Username must be at least 7 characters long."
      );
    } else if (!/^[a-zA-Z0-9@._-]+$/.test(username)) {
      showError(
        usernameInput,
        usernameError,
        "Username can only contain letters, numbers, @, ., _, and -"
      );
    } else {
      hideError(usernameInput, usernameError);
    }
  }

  function validateFullname() {
    const fullname = fullnameInput.value.trim();
    if (fullname.length === 0) {
      showError(fullnameInput, fullnameError, "Full Name is required.");
    } else if (fullname.length < 2) {
      showError(
        fullnameInput,
        fullnameError,
        "Full name must be at least  2 characters long."
      );
    } else if (!/^[a-zA-Z\s]+$/.test(fullname)) {
      showError(
        fullnameInput,
        fullnameError,
        "Full name can only contain letters and spaces."
      );
    } else {
      hideError(fullnameInput, fullnameError);
    }
  }

  function validatePasswordField() {
    const password = passwordInput.value;
    if (password.length === 0) {
      showError(passwordInput, passwordError, "Password is required.");
      passwordStrength.textContent = "";
      return;
    }
    const validations = validatePassword(password);
    if (validations.errors.length > 0) {
      showError(passwordInput, passwordError, validations.errors.join(" "));
    } else {
      hideError(passwordInput, passwordError);
    }
    updatePasswordStrength(validations.strength);
  }

  function validateConfirmPassword() {
    const confirmPassword = confirmPasswordInput.value;
    const password = passwordInput.value;
    if (confirmPassword.length === 0) {
      showError(
        confirmPasswordInput,
        confirmPasswordError,
        "Confirm password is required."
      );
    } else if (confirmPassword !== password) {
      showError(
        confirmPasswordInput,
        confirmPasswordError,
        "Passwords do not match."
      );
    } else {
      hideError(confirmPasswordInput, confirmPasswordError);
    }
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    if (email.length === 0) {
      showError(emailInput, emailError, "Email is required.");
    } else if (email.length < 10) {
      showError(
        emailInput,
        emailError,
        "Please provide correct Email ID. Email Min 10 character & Max 70 character."
      );
    } else if (email.length > 70) {
      showError(
        emailInput,
        emailError,
        "Please provide correct Email ID. Email Min 10 character & Max 70 character."
      );
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      showError(emailInput, emailError, "Please provide correct Email ID.");
    } else {
      hideError(emailInput, emailError);
    }
  }

  function validateMobile() {
    const mobile = mobileInput.value.trim();
    if (mobile.length === 0) {
      showError(mobileInput, mobileError, "Mobile No is required.");
    } else if (!/^\d{10}$/.test(mobile)) {
      showError(
        mobileInput,
        mobileError,
        "Mobile number must be exactly 10 digits."
      );
    } else {
      hideError(mobileInput, mobileError);
    }
  }

  // Real-time validation
  // Removed duplicate declarations and event listeners to fix redeclaration errors

  function validatePassword(password) {
    const errors = [];
    let strength = "weak";

    if (password.length < 11) {
      errors.push("Password must be at least 11 characters long.");
    }
    if (password.length > 15) {
      errors.push("Password must not exceed 15 characters.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push(
        'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).'
      );
    }

    // Calculate strength
    if (errors.length === 0) {
      if (
        password.length >= 13 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
      ) {
        strength = "strong";
      } else if (password.length >= 11) {
        strength = "medium";
      }
    }

    return { errors, strength };
  }

  function updatePasswordStrength(strength) {
    passwordStrength.className = "password-strength " + strength;
    passwordStrength.textContent =
      "Password Strength: " +
      strength.charAt(0).toUpperCase() +
      strength.slice(1);
  }

  function showError(input, errorElement, message) {
    input.classList.add("error");
    input.classList.remove("valid");
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }

  function hideError(input, errorElement) {
    input.classList.remove("error");
    input.classList.add("valid");
    errorElement.classList.remove("show");
  }

  // Add some visual feedback for input fields
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.style.transform = "scale(1.02)";
      this.style.transition = "transform 0.2s ease";
    });

    input.addEventListener("blur", function () {
      this.style.transform = "scale(1)";
    });
  });

  // Side Menu Functionality
  menuToggle.addEventListener("click", function () {
    toggleMenu();
  });

  menuOverlay.addEventListener("click", function () {
    closeMenu();
  });

  // Handle dropdown menus
  menuMains.forEach((menuMain) => {
    menuMain.addEventListener("click", function () {
      const menuType = this.getAttribute("data-menu");
      const submenu = document.getElementById(menuType + "-submenu");

      // Close other submenus
      document.querySelectorAll(".submenu.active").forEach((sm) => {
        if (sm !== submenu) {
          sm.classList.remove("active");
          sm.parentElement
            .querySelector(".menu-main")
            .classList.remove("active");
        }
      });

      // Toggle current submenu
      submenu.classList.toggle("active");
      this.classList.toggle("active");
    });
  });

  function toggleMenu() {
    sideMenu.classList.toggle("active");
    menuOverlay.classList.toggle("active");
    menuToggle.classList.toggle("active");
  }

  function closeMenu() {
    sideMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    menuToggle.classList.remove("active");

    // Close all submenus
    document.querySelectorAll(".submenu.active").forEach((submenu) => {
      submenu.classList.remove("active");
      submenu.parentElement
        .querySelector(".menu-main")
        .classList.remove("active");
    });
  }
});
