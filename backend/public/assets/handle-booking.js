// Function to handle direct booking
function handleDirectBooking(trainId, selectedClass) {
  // Get the selection if it exists
  const selection = selectedAvailability.get(trainId);
  if (!selection) {
    alert("Please select a date first");
    return;
  }

  const bookingDetails = {
    trainId,
    class: selectedClass,
    from: fromStation,
    to: toStation,
    date: selection.date,
    price: selection.price,
  };

  // Save to sessionStorage
  sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

  // Create URL parameters
  const searchParams = new URLSearchParams({
    trainId,
    from: fromStation,
    to: toStation,
    date: selection.date,
    class:
      selectedClass === "Sleeper" ? "SL" : selectedClass === "AC" ? "3A" : "SL",
    price: selection.price,
  });

  // Redirect to booking page
  window.location.href = `/book-ticket.html?${searchParams.toString()}`;
}
