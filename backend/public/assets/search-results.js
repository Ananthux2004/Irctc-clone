// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const fromStation = urlParams.get("from");
const toStation = urlParams.get("to");
const journeyDate = urlParams.get("date");
const classType = urlParams.get("class") || "All Classes";

// Set initial filter values
document.getElementById("fromStation").value = fromStation;
document.getElementById("toStation").value = toStation;
document.getElementById("journeyDate").value = journeyDate;
document.getElementById("classType").value = classType;

// Function to switch stations
function switchStations() {
  const fromInput = document.getElementById("fromStation");
  const toInput = document.getElementById("toStation");
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;
  searchTrains();
}

// Function to modify search
function modifySearch() {
  const from = document.getElementById("fromStation").value;
  const to = document.getElementById("toStation").value;
  const date = document.getElementById("journeyDate").value;
  const classType = document.getElementById("classType").value;
  searchTrains(from, to, date, classType);
}

// Function to search trains
async function searchTrains(from = fromStation, to = toStation, date = journeyDate, classType = document.getElementById("classType").value) {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const noResults = document.getElementById("noResults");
  const trainCards = document.getElementById("trainCards");

  if (!from || !to) {
    noResults.innerHTML = '<h2>Please provide both source and destination stations</h2>';
    noResults.style.display = "block";
    return;
  }

  loadingSpinner.style.display = "block";
  noResults.style.display = "none";
  trainCards.innerHTML = "";

  try {
    const params = new URLSearchParams({
      from: from,
      to: to,
      date: date || '',
      class: classType || 'All Classes'
    });

    const response = await fetch(`/api/trains/search?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    loadingSpinner.style.display = "none";

    if (data.length === 0) {
      noResults.style.display = "block";
      return;
    }

    data.forEach((train) => {
      const card = createTrainCard(train);
      trainCards.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching trains:", error);
    loadingSpinner.style.display = "none";
    noResults.style.display = "block";
    noResults.innerHTML =
      "<h2>Error loading trains</h2><p>Please try again later</p>";
  }
}

// Function to create train card
function createTrainCard(train) {
  const card = document.createElement("div");
  card.className = "train-card";
  card.innerHTML = `
        <div class="train-header">
            <div class="train-name">${train.name}</div>
            <div class="train-number">#${train.number}</div>
        </div>
        <div class="train-schedule">
            <div class="schedule-item">
                <div class="time">${train.departureTime}</div>
                <div class="station">${train.source}</div>
            </div>
            <div class="schedule-item">
                <div class="time">${train.arrivalTime}</div>
                <div class="station">${train.destination}</div>
            </div>
        </div>
        <div class="train-info">
            <div class="info-item">
                <span class="info-label">Duration:</span>
                <span class="info-value">${train.duration}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Distance:</span>
                <span class="info-value">${train.distance} km</span>
            </div>
            <div class="info-item">
                <span class="info-label">Days:</span>
                <span class="info-value">${train.runningDays.join(", ")}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value">${train.status}</span>
            </div>
        </div>
        <div class="fare-section">
            ${Object.entries(train.fareDetails)
              .map(
                ([className, fare]) => `
                <div class="class-fare">
                    <span>${className}</span>
                    <span>₹${fare}</span>
                </div>
            `
              )
              .join("")}
        </div>
    `;
  return card;
}

// Initial search with URL parameters
if (fromStation && toStation && journeyDate) {
  searchTrains(fromStation, toStation, journeyDate, classType);
}
