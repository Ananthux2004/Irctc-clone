// Initialize event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listener to the proceed button
  const proceedButton = document.getElementById("proceedToPayment");
  if (proceedButton) {
    proceedButton.addEventListener("click", handlePaymentSubmission);
    console.log("Payment button event listener attached");
  } else {
    console.error("Proceed to Payment button not found");
  }
});

// Function to handle payment submission
function handlePaymentSubmission() {
  console.log("handlePaymentSubmission called");
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
  console.log("Showing billing summary with details:", bookingDetails);
  showBillingSummary(bookingDetails);
}

// Function to validate payment form
function validatePaymentForm(paymentMethod) {
  const paymentForm = document.querySelector(".payment-form");
  if (!paymentForm) {
    // If no payment form is present yet, consider it valid
    return true;
  }
  const requiredFields = paymentForm.querySelectorAll("[required]");
  return Array.from(requiredFields).every((field) => field.value.trim() !== "");
}

// Function to collect all booking details
function collectBookingDetails() {
  const userData = session.getUserData();
  console.log("User data in collectBookingDetails:", userData);

  // Verify session data
  if (!userData || !userData.userId) {
    console.error("Invalid or missing user data in session:", userData);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const seats = parseInt(document.getElementById("numberOfSeats").value);
  const basePrice = state.basePrice * seats;
  const gst = Math.round(basePrice * 0.05);
  const convenienceFee = 30 * seats;

  const bookingDetails = {
    userId: userData?.userId || userData?.id, // Try both possible ID fields
    trainId: urlParams.get("trainId"),
    from: urlParams.get("from"),
    to: urlParams.get("to"),
    date: urlParams.get("date"),
    class: document.getElementById("seatClass").value,
    seats: seats,
    baseFare: basePrice,
    totalAmount: basePrice + gst + convenienceFee,
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')
      ?.value,
  };

  console.log("Collected booking details:", bookingDetails);
  return bookingDetails;
}

// Function to submit booking after payment confirmation
function submitBooking(bookingDetails) {
  // Add additional fields for booking record
  const finalBookingDetails = {
    ...bookingDetails,
    status: "confirmed",
    bookingDate: new Date().toISOString(),
    journey: `${bookingDetails.from} to ${bookingDetails.to}`,
    gst: Math.round(bookingDetails.baseFare * 0.05),
    convenienceFee: bookingDetails.seats * 30,
  };

  console.log("Submitting booking details:", finalBookingDetails);

  fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalBookingDetails),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Store booking reference in local storage
        localStorage.setItem("lastBookingId", data.bookingId);

        // Show success message and redirect
        window.location.href = `/booking-confirmation.html?bookingId=${data.bookingId}`;
      } else {
        console.error("Booking failed:", data);
        alert("Booking failed: " + (data.message || "Please try again"));
      }
    })
    .catch((error) => {
      console.error("Error submitting booking:", error);
      alert(
        "An error occurred while processing your booking. Please try again."
      );
    });
}
