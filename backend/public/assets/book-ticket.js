// Global variables for DOM elements
const elements = {
  seatClass: null,
  numberOfSeats: null,
  decrementBtn: null,
  incrementBtn: null,
  baseFare: null,
  gst: null,
  convenienceFee: null,
  totalAmount: null,
};

// Global state
const state = {
  basePrice: 0,
  trainId: "",
  urlParams: null,
  selectedClass: "SL",
  defaultPrices: {
    AC: 1000,
    SL: 400,
    GEN: 200,
    "3A": 1000, // AC class price
  },
  classMapping: {
    SL: "sleeper",
    AC: "ac",
    GEN: "general",
    "3A": "ac", // Map 3A to AC in database
  },
};

// Initialize variables and setup functions
function initializeVariables() {
  state.urlParams = new URLSearchParams(window.location.search);
  state.trainId = state.urlParams.get("trainId");
  state.selectedClass = state.urlParams.get("class") || "SL";

  // Initialize DOM elements
  elements.seatClass = document.getElementById("seatClass");
  elements.numberOfSeats = document.getElementById("numberOfSeats");
  elements.decrementBtn = document.getElementById("decrementSeats");
  elements.incrementBtn = document.getElementById("incrementSeats");
  elements.baseFare = document.getElementById("baseFare");
  elements.gst = document.getElementById("gst");
  elements.convenienceFee = document.getElementById("convenienceFee");
  elements.totalAmount = document.getElementById("totalAmount");

  if (!state.trainId) {
    console.error("No train ID provided in URL");
    return false;
  }

  // Set initial values
  if (elements.numberOfSeats) elements.numberOfSeats.value = 1;
  if (elements.decrementBtn) elements.decrementBtn.disabled = true;
  if (elements.seatClass) elements.seatClass.value = state.selectedClass;

  console.log("Initialized with:", {
    trainId: state.trainId,
    selectedClass: state.selectedClass,
    elements: Object.keys(elements).reduce(
      (acc, key) => ({
        ...acc,
        [key]: elements[key] ? "Found" : "Not Found",
      }),
      {}
    ),
  });

  return true;
}

// Function to update price details display
function updatePriceDetails() {
  console.log("Updating prices...");

  const seatCount = parseInt(elements.numberOfSeats.value) || 1;
  const currentClass = elements.seatClass.value;

  console.log("Price calculation for:", {
    currentClass,
    seatCount,
    basePrice: state.basePrice,
  });

  // Calculate total base fare based on number of seats
  const baseFare = state.basePrice * seatCount;
  const gst = Math.round(baseFare * 0.05);
  const convenienceFee = 30 * seatCount;
  const totalAmount = baseFare + gst + convenienceFee;

  // Update price display
  document.getElementById("baseFare").textContent = `₹${baseFare}`;
  document.getElementById("gst").textContent = `₹${gst}`;
  document.getElementById("convenienceFee").textContent = `₹${convenienceFee}`;
  document.getElementById("totalAmount").textContent = `₹${totalAmount}`;
}

// Function to fetch train details and update price
async function fetchTrainDetailsAndPrice() {
  try {
    const response = await fetch(`/api/trains/${state.trainId}`);
    if (!response.ok) throw new Error("Failed to fetch train details");
    const trainData = await response.json();

    // Get the current selected class
    const currentClass = elements.seatClass.value;
    const dbField = state.classMapping[currentClass];

    // Update base price using the mapping
    state.basePrice =
      trainData.price?.[dbField] || state.defaultPrices[currentClass] || 0;

    console.log("Price mapping:", {
      currentClass,
      dbField,
      trainPrice: trainData.price?.[dbField],
      defaultPrice: state.defaultPrices[currentClass],
      finalPrice: state.basePrice,
    });

    console.log("Fetched train details:", {
      trainData,
      selectedClass: state.selectedClass,
      mappedClass: state.classMapping[state.selectedClass],
      basePrice: state.basePrice,
    });

    // Update the price display immediately after fetching
    updatePriceDetails();
  } catch (error) {
    console.error("Error fetching train details:", error);
  }
}

// Setup all event handlers
function setupAllHandlers() {
  if (elements.incrementBtn) {
    elements.incrementBtn.onclick = () => {
      let count = parseInt(elements.numberOfSeats.value) || 1;
      if (count < 6) {
        count++;
        elements.numberOfSeats.value = count;
        updatePriceDetails();
        elements.decrementBtn.disabled = false;
        elements.incrementBtn.disabled = count >= 6;
      }
    };
  }

  if (elements.decrementBtn) {
    elements.decrementBtn.onclick = () => {
      let count = parseInt(elements.numberOfSeats.value) || 1;
      if (count > 1) {
        count--;
        elements.numberOfSeats.value = count;
        updatePriceDetails();
        elements.incrementBtn.disabled = false;
        elements.decrementBtn.disabled = count <= 1;
      }
    };
  }

  if (elements.seatClass) {
    elements.seatClass.onchange = async (e) => {
      console.log("Class changed to:", e.target.value);
      await fetchTrainDetailsAndPrice();
    };
  }

  if (elements.numberOfSeats) {
    elements.numberOfSeats.onkeydown = (e) => e.preventDefault();
  }
}

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Check session first
  if (!session.checkSession()) {
    window.location.href = "/login.html";
    return;
  }

  // Initialize variables
  if (!initializeVariables()) {
    return;
  }

  // Fetch train details and price
  await fetchTrainDetailsAndPrice();

  // Setup all event handlers
  // This function is replaced by setupAllHandlers() above

  // Setup all event handlers
  setupAllHandlers();

  // This is now handled by the global updatePriceDetails() function

  // Get URL parameters with default values
  const fromStation = state.urlParams.get("from") || "Not specified";
  const toStation = state.urlParams.get("to") || "Not specified";
  const date = state.urlParams.get("date") || "Not specified";

  console.log("URL Parameters:", { fromStation, toStation, date });

  // Initialize booking functionality with state values
  initializeBookingPage(state.trainId, fromStation, toStation, date);

  // Display user info in navbar
  const userData = session.getUserData();
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
  console.log("Fetching train details for:", {
    trainId,
    fromStation,
    toStation,
    date,
  });

  fetch(`/api/trains/${trainId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((train) => {
      console.log("Received train data:", train);

      const trainName = train?.trainName || "Unknown Train";
      const trainNumber = train?.trainNumber || "";
      const displayFromStation = fromStation || "Not specified";
      const displayToStation = toStation || "Not specified";
      const displayDate = date || "Not specified";

      document.getElementById("trainDetails").innerHTML = `
                <h3>${trainName} ${trainNumber ? `(${trainNumber})` : ""}</h3>
                <p>From: ${displayFromStation} - To: ${displayToStation}</p>
                <p>Date: ${displayDate}</p>
            `;
    })
    .catch((error) => {
      console.error("Error fetching train details:", {
        error,
        trainId,
        fromStation,
        toStation,
        date,
      });
      document.getElementById("trainDetails").innerHTML = `
                <h3>Error loading train details</h3>
                <p>Please try refreshing the page</p>
            `;
    });
}

// This is now handled by global state management and event handlers

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
  const userData = session.getUserData();
  return {
    userId: userData.userId,
    trainId: new URLSearchParams(window.location.search).get("trainId"),
    seatClass: document.getElementById("seatClass").value,
    numberOfSeats: document.getElementById("numberOfSeats").value,
    totalAmount: document
      .getElementById("totalAmount")
      .textContent.replace("₹", ""),
    basePrice: state.basePrice,
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
