// Function to show billing popup with dynamic content
function showBillingSummary(bookingDetails) {
  console.log("showBillingSummary called with:", bookingDetails);
  const billingDetails = document.getElementById("billingDetails");
  if (!billingDetails) {
    console.error("Billing details element not found");
    return;
  }

  // Format date for display
  const formattedDate = new Date(bookingDetails.date).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  // Get user data from session and the booking details
  const userData = session.getUserData();
  console.log("User data in billing summary:", userData);

  billingDetails.innerHTML = `
        <div class="billing-row">
            <span class="billing-label">User ID:</span>
            <span class="billing-value">${
              bookingDetails.userId || userData?.userId || "Guest"
            }</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">Train ID:</span>
            <span class="billing-value">${bookingDetails.trainId}</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">Journey:</span>
            <span class="billing-value">${bookingDetails.from} to ${
    bookingDetails.to
  }</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">Date:</span>
            <span class="billing-value">${formattedDate}</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">Seat Class:</span>
            <span class="billing-value">${bookingDetails.class}</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">Seats:</span>
            <span class="billing-value">${bookingDetails.seats || 1}</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">Base Fare:</span>
            <span class="billing-value">₹${bookingDetails.baseFare}</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">GST (5%):</span>
            <span class="billing-value">₹${Math.round(
              bookingDetails.baseFare * 0.05
            )}</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">Convenience Fee:</span>
            <span class="billing-value">₹${
              (bookingDetails.seats || 1) * 30
            }</span>
        </div>
        <div class="billing-row total">
            <span class="billing-label">Total Amount:</span>
            <span class="billing-value">₹${bookingDetails.totalAmount}</span>
        </div>
        <div class="billing-row">
            <span class="billing-label">Payment Method:</span>
            <span class="billing-value">${bookingDetails.paymentMethod}</span>
        </div>
    `;

  // Show billing popup
  document.getElementById("billingPopup").style.display = "flex";
}

// Function to close billing popup
function closeBillingPopup() {
  document.getElementById("billingPopup").style.display = "none";
  document.getElementById("checkmarkOverlay").style.display = "none";
  document.querySelector(".popup-content").classList.remove("inactive");
}

// Initialize payment button handler
document.getElementById("payNow").addEventListener("click", function () {
  // Get the current booking details from the popup
  const billingRows = document.querySelectorAll(".billing-row");
  const bookingData = {
    userId: billingRows[0].querySelector(".billing-value").textContent.trim(),
    trainId: billingRows[1].querySelector(".billing-value").textContent.trim(),
    journey: billingRows[2].querySelector(".billing-value").textContent.trim(),
    date: billingRows[3].querySelector(".billing-value").textContent.trim(),
    seatClass: billingRows[4]
      .querySelector(".billing-value")
      .textContent.trim(),
    seats: parseInt(
      billingRows[5].querySelector(".billing-value").textContent.trim()
    ),
    baseFare: parseFloat(
      billingRows[6]
        .querySelector(".billing-value")
        .textContent.replace("₹", "")
    ),
    gst: parseFloat(
      billingRows[7]
        .querySelector(".billing-value")
        .textContent.replace("₹", "")
    ),
    convenienceFee: parseFloat(
      billingRows[8]
        .querySelector(".billing-value")
        .textContent.replace("₹", "")
    ),
    totalAmount: parseFloat(
      billingRows[9]
        .querySelector(".billing-value")
        .textContent.replace("₹", "")
    ),
    paymentMethod: billingRows[10]
      .querySelector(".billing-value")
      .textContent.trim(),
    status: "confirmed",
    bookingDate: new Date().toISOString(),
  };

  console.log("Submitting booking:", bookingData);

  // Submit booking to the server
  fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Booking successful:", data);

        // Show the checkmark animation
        const checkmarkOverlay = document.getElementById("checkmarkOverlay");
        checkmarkOverlay.style.display = "flex";

        // Dim the billing popup content
        document.querySelector(".popup-content").classList.add("inactive");

        // Auto-close both popups after animation and redirect
        setTimeout(function () {
          document.getElementById("billingPopup").style.display = "none";
          checkmarkOverlay.style.display = "none";
          document.querySelector(".popup-content").classList.remove("inactive");

          // Redirect to booking confirmation page
          window.location.href = `/booking-confirmation.html?bookingId=${data.bookingId}`;
        }, 2000);
      } else {
        console.error("Booking failed:", data);
        alert("Failed to save booking. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error saving booking:", error);
      alert("An error occurred while saving your booking. Please try again.");
    });
});
