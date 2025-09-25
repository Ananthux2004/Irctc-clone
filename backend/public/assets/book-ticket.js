// Import session utilities
import { getUserData, checkSession } from "./session.js";

// Check if user is logged in
document.addEventListener("DOMContentLoaded", () => {
  if (!checkSession()) {
    window.location.href = "/login.html";
    return;
  }

  // Display user info in navbar
  const userData = getUserData();
  if (userData && userData.username) {
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
      userInfo.textContent = userData.username;
    }
  }

  // Initialize form handling
  initializeForm();
});

function initializeForm() {
  const bookingForm = document.getElementById("bookingForm");
  const searchBtn = document.querySelector(".search-btn");
  const bookingBtn = document.querySelector(".booking-btn");

  // Date input min/max setup
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 4);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  dateInputs.forEach((input) => {
    input.min = today;
    input.max = maxDateStr;
  });

  // Form validation
  function validateForm() {
    let isValid = true;
    const requiredFields = bookingForm.querySelectorAll(
      "input[required], select[required]"
    );

    requiredFields.forEach((field) => {
      const inputGroup = field.closest(".input-group");
      if (!field.value.trim()) {
        isValid = false;
        inputGroup.classList.add("error");
        inputGroup.classList.remove("success");
      } else {
        inputGroup.classList.remove("error");
        inputGroup.classList.add("success");
      }
    });

    return isValid;
  }

  // Search button handler
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Collect form data
      const formData = new FormData(bookingForm);
      const searchData = Object.fromEntries(formData.entries());

      // TODO: Implement search functionality
      console.log("Search Data:", searchData);
      alert("Searching for trains... This feature will be implemented soon.");
    }
  });

  // Booking button handler
  bookingBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Collect form data
      const formData = new FormData(bookingForm);
      const bookingData = Object.fromEntries(formData.entries());

      // Add user ID from session
      const userData = getUserData();
      if (userData && userData.userId) {
        bookingData.userId = userData.userId;
      }

      // TODO: Implement booking functionality
      console.log("Booking Data:", bookingData);
      alert("Booking feature will be implemented soon.");
    }
  });

  // Real-time validation
  const inputs = bookingForm.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const inputGroup = input.closest(".input-group");
      if (input.hasAttribute("required")) {
        if (!input.value.trim()) {
          inputGroup.classList.add("error");
          inputGroup.classList.remove("success");
        } else {
          inputGroup.classList.remove("error");
          inputGroup.classList.add("success");
        }
      }
    });
  });

  // Station search suggestions (to be implemented)
  const stationInputs = document.querySelectorAll('input[type="text"]');
  stationInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      // TODO: Implement station search suggestions
      console.log("Searching stations:", e.target.value);
    });
  });
}
