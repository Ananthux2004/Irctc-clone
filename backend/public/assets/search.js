const searchForm = document.getElementById("trainSearchForm");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fromStation = document.getElementById("fromStation").value;
  const toStation = document.getElementById("toStation").value;
  const journeyDate = document.getElementById("journeyDate").value;
  const classType = document.getElementById("classType").value;

  // Redirect to search results page with query parameters
  window.location.href = `search-results.html?from=${encodeURIComponent(
    fromStation
  )}&to=${encodeURIComponent(toStation)}&date=${encodeURIComponent(
    journeyDate
  )}&class=${encodeURIComponent(classType)}`;
});

// Function to switch stations
document.querySelector(".switch-stations").addEventListener("click", () => {
  const fromInput = document.getElementById("fromStation");
  const toInput = document.getElementById("toStation");
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;
});

// Set min date as today
const dateInput = document.getElementById("journeyDate");
const today = new Date().toISOString().split("T")[0];
dateInput.min = today;
