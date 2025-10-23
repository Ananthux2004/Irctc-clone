// Import session utilities
import { getUserData, checkSession } from "./session.js";

// Base fare for different classes
const baseFares = {
  SL: 400,
  "3A": 1000,
  "2A": 1800,
  "1A": 3000,
};

// Check if user is logged in
document.addEventListener("DOMContentLoaded", () => {
  if (!checkSession()) {
    window.location.href = "/login.html";
    return;
  }

  // Get DOM elements
  const seatClass = document.getElementById("seatClass");
  const numberOfSeats = document.getElementById("numberOfSeats");
  const decrementBtn = document.getElementById("decrementSeats");
  const incrementBtn = document.getElementById("incrementSeats");

  console.log("Elements:", {
    seatClass,
    numberOfSeats,
    decrementBtn,
    incrementBtn,
  }); // Debug log

  // Setup increment button
  incrementBtn.onclick = () => {
    let count = parseInt(numberOfSeats.value) || 1;
    if (count < 6) {
      count++;
      numberOfSeats.value = count;
      updatePriceDetails();
      decrementBtn.disabled = false;
      incrementBtn.disabled = count >= 6;
    }
  };

  // Setup decrement button
  decrementBtn.onclick = () => {
    let count = parseInt(numberOfSeats.value) || 1;
    if (count > 1) {
      count--;
      numberOfSeats.value = count;
      updatePriceDetails();
      incrementBtn.disabled = false;
      decrementBtn.disabled = count <= 1;
    }
  };

  // Setup seat class change handler
  seatClass.onchange = updatePriceDetails;

  // Prevent manual input in number field
  numberOfSeats.onkeydown = (e) => e.preventDefault();

  // Initial setup
  numberOfSeats.value = 1;
  decrementBtn.disabled = true; // Disable decrement at start since count is 1
  updatePriceDetails();

  function updatePriceDetails() {
    console.log("Updating prices..."); // Debug log

    const seatCount = parseInt(numberOfSeats.value) || 1;
    const currentClass = seatClass.value;
    const baseFare = baseFares[currentClass] * seatCount;
    const gst = Math.round(baseFare * 0.05);
    const convenienceFee = 30 * seatCount;
    const totalAmount = baseFare + gst + convenienceFee;

    console.log("Calculations:", {
      seatCount,
      currentClass,
      baseFare,
      gst,
      convenienceFee,
      totalAmount,
    }); // Debug log

    // Update price displays
    try {
      document.getElementById("baseFare").textContent = `₹${baseFare}`;
      document.getElementById("gst").textContent = `₹${gst}`;
      document.getElementById(
        "convenienceFee"
      ).textContent = `₹${convenienceFee}`;
      document.getElementById("totalAmount").textContent = `₹${totalAmount}`;
    } catch (error) {
      console.error("Error updating price displays:", error);
    }
  }

  // Initial price calculation
  if (seatClass && numberOfSeats) {
    seatClass.addEventListener("change", updatePriceDetails);
    updatePriceDetails();
  }

  // Get train details from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const trainId = urlParams.get("trainId");
  const fromStation = urlParams.get("from");
  const toStation = urlParams.get("to");
  const date = urlParams.get("date");

  // Initialize booking functionality
  initializeBookingPage(trainId, fromStation, toStation, date);

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

function initializeBookingPage(trainId, fromStation, toStation, date) {
  // Display train details
  displayTrainDetails(trainId, fromStation, toStation, date);

  // Initialize price calculations and payment handlers
  initializePriceCalculator();
  initializePaymentHandlers();
}

function displayTrainDetails(trainId, fromStation, toStation, date) {
  fetch(`/api/trains/${trainId}`)
    .then((response) => response.json())
    .then((train) => {
      document.getElementById("trainDetails").innerHTML = `
                <h3>${train.name} (${train.number})</h3>
                <p>From: ${fromStation} - To: ${toStation}</p>
                <p>Date: ${date}</p>
            `;
    })
    .catch((error) => console.error("Error:", error));
}

function initializePriceCalculator() {
  const seatClass = document.getElementById("seatClass");
  const numberOfSeats = document.getElementById("numberOfSeats");
  const decrementBtn = document.getElementById("decrementSeats");
  const incrementBtn = document.getElementById("incrementSeats");

  function updatePriceDetails() {
    const seatCount = parseInt(numberOfSeats.value);
    const baseFare = baseFares[seatClass.value] * seatCount;
    const gst = baseFare * 0.05;
    const convenienceFee = 30 * seatCount;
    const totalAmount = baseFare + gst + convenienceFee;

    document.getElementById("baseFare").textContent = `₹${baseFare}`;
    document.getElementById("gst").textContent = `₹${gst}`;
    document.getElementById(
      "convenienceFee"
    ).textContent = `₹${convenienceFee}`;
    document.getElementById("totalAmount").textContent = `₹${totalAmount}`;

    // Update button states
    decrementBtn.disabled = seatCount <= 1;
    incrementBtn.disabled = seatCount >= 6;
  }

  function handleIncrement() {
    const currentValue = parseInt(numberOfSeats.value);
    if (currentValue < 6) {
      numberOfSeats.value = currentValue + 1;
      updatePriceDetails();
    }
  }

  function handleDecrement() {
    const currentValue = parseInt(numberOfSeats.value);
    if (currentValue > 1) {
      numberOfSeats.value = currentValue - 1;
      updatePriceDetails();
    }
  }

  seatClass.addEventListener("change", updatePriceDetails);
  incrementBtn.addEventListener("click", handleIncrement);
  decrementBtn.addEventListener("click", handleDecrement);

  // Prevent manual input
  numberOfSeats.addEventListener("keydown", (e) => e.preventDefault());

  updatePriceDetails(); // Initial calculation
}

function initializePaymentHandlers() {
  const paymentMethods = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  const paymentDetails = document.getElementById("paymentDetails");
  const proceedButton = document.getElementById("proceedToPayment");

  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      updatePaymentForm(this.value, paymentDetails);
    });
  });

  proceedButton.addEventListener("click", handlePaymentSubmission);
}

function updatePaymentForm(paymentMethod, container) {
  const forms = {
    upi: `
            <div class="payment-form">
                <div class="form-group">
                    <label for="upiId">UPI ID</label>
                    <input type="text" id="upiId" placeholder="Enter your UPI ID" required>
                </div>
            </div>
        `,
    card: `
            <div class="payment-form">
                <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="form-group">
                    <label for="cardName">Name on Card</label>
                    <input type="text" id="cardName" placeholder="Enter name as on card" required>
                </div>
                <div style="display: flex; gap: 15px;">
                    <div class="form-group">
                        <label for="expiryDate">Expiry Date</label>
                        <input type="text" id="expiryDate" placeholder="MM/YY" required>
                    </div>
                    <div class="form-group">
                        <label for="cvv">CVV</label>
                        <input type="password" id="cvv" placeholder="***" required>
                    </div>
                </div>
            </div>
        `,
    netBanking: `
            <div class="payment-form">
                <div class="form-group">
                    <label for="bank">Select Bank</label>
                    <select id="bank" required>
                        <option value="">Select a bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                    </select>
                </div>
            </div>
        `,
  };

  container.innerHTML = forms[paymentMethod] || "";
}

function handlePaymentSubmission() {
  const selectedPaymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );
  if (!selectedPaymentMethod) {
    alert("Please select a payment method");
    return;
  }

  if (!validatePaymentForm(selectedPaymentMethod.value)) {
    alert("Please fill all payment details correctly");
    return;
  }

  const bookingDetails = collectBookingDetails();
  submitBooking(bookingDetails);
}

function validatePaymentForm(paymentMethod) {
  const paymentForm = document.querySelector(".payment-form");
  const requiredFields = paymentForm.querySelectorAll("[required]");
  return Array.from(requiredFields).every((field) => field.value.trim() !== "");
}

function collectBookingDetails() {
  const userData = getUserData();
  return {
    userId: userData.userId,
    trainId: new URLSearchParams(window.location.search).get("trainId"),
    seatClass: document.getElementById("seatClass").value,
    numberOfSeats: document.getElementById("numberOfSeats").value,
    totalAmount: document
      .getElementById("totalAmount")
      .textContent.replace("₹", ""),
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')
      .value,
  };
}

function submitBooking(bookingDetails) {
  fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingDetails),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Booking successful! Your booking ID is: " + data.bookingId);
        window.location.href = `/booking-confirmation.html?bookingId=${data.bookingId}`;
      } else {
        alert("Booking failed: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        "An error occurred while processing your booking. Please try again."
      );
    });
}

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

