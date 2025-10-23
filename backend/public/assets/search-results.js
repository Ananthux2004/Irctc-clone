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
async function searchTrains(
  from = fromStation,
  to = toStation,
  date = journeyDate,
  classType = document.getElementById("classType").value
) {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const noResults = document.getElementById("noResults");
  const trainCards = document.getElementById("trainCards");

  if (!from || !to) {
    noResults.innerHTML =
      "<h2>Please provide both source and destination stations</h2>";
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
      date: date || "",
      class: classType || "All Classes",
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

  const availableSeats = train.availableSeats || {
    sleeper: Math.floor(Math.random() * 50) + 1, // Random number between 1 and 50 for testing
    ac: Math.floor(Math.random() * 30) + 1, // Random number between 1 and 30 for testing
    general: Math.floor(Math.random() * 100) + 1, // Random number between 1 and 100 for testing
  };

  card.innerHTML = `
        <button onclick="bookTicket('${
          train.id
        }', 'Sleeper')" class="book-now-btn">Book Now</button>
        <div class="train-header">
            <div class="train-name">${train.name}</div>
            <div class="train-number">${train.number}</div>
        </div>
        <div class="train-schedule">
            <div class="schedule-item">
                <div class="station">${train.source}</div>
                <div class="datetime-info">
                    <span>${new Date(journeyDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}</span>
                    <span class="datetime-separator">|</span>
                    <span>${train.departureTime}</span>
                </div>
            </div>
            <div class="schedule-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
            <div class="schedule-item">
                <div class="station">${train.destination}</div>
                <div class="datetime-info">
                    <span>${new Date(journeyDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}</span>
                    <span class="datetime-separator">|</span>
                    <span>${train.arrivalTime}</span>
                </div>
            </div>
        </div>
        <div class="runs-on">
            <div class="runs-on-title" style="color: #666; margin-bottom: 8px;">Runs On</div>
            <div class="days-list">
                ${(() => {
                  const daysMap = [
                    { short: "M", full: "Monday" },
                    { short: "T", full: "Tuesday" },
                    { short: "W", full: "Wednesday" },
                    { short: "T", full: "Thursday" },
                    { short: "F", full: "Friday" },
                    { short: "S", full: "Saturday" },
                    { short: "S", full: "Sunday" },
                  ];

                  return daysMap
                    .map((day) => {
                      const runs =
                        Array.isArray(train.runningDays) &&
                        train.runningDays.includes(day.full);

                      return `
                            <span class="day-indicator ${
                              runs ? "day-active" : "day-inactive"
                            }" 
                                  title="${
                                    runs
                                      ? `Runs on ${day.full}`
                                      : `No service on ${day.full}`
                                  }">
                                ${day.short}
                            </span>`;
                    })
                    .join("");
                })()}
            </div>
        </div>
        <div class="seat-class-nav">
            <div class="seat-class-tabs">
                <button class="seat-class-tab active" data-class="Sleeper">Sleeper</button>
                <button class="seat-class-tab" data-class="AC">AC</button>
                <button class="seat-class-tab" data-class="General">General</button>
            </div>
            <div class="availability-section">
                <div class="availability-scroll">
                    ${(() => {
                      const today = new Date(journeyDate);
                      const availabilityCards = [];
                      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                      // Generate next 14 days and filter for running days only
                      for (let i = 0; i < 14; i++) {
                        const date = new Date(today);
                        date.setDate(date.getDate() + i);
                        const dayName = daysOfWeek[date.getDay()];

                        // Check if train runs on this day
                        if (Array.isArray(train.runningDays) && train.runningDays.includes(dayName)) {
                          // Default to Sleeper class for initial display
                          const seats = availableSeats.sleeper;

                          const availability =
                            seats > 0
                              ? `${seats} Seats`
                              : "WL" + Math.floor(Math.random() * 100); // Simulated waitlist

                          const statusClass = seats > 0 ? "available" : "waiting";

                          availabilityCards.push(`
                                <div class="availability-card">
                                    <div class="availability-date">
                                        ${date.toLocaleDateString("en-US", {
                                          weekday: "short",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                    </div>
                                    <div class="availability-status ${statusClass}">
                                        ${availability}
                                    </div>
                                </div>
                            `);
                        }
                      }

                      // If no cards were created, show a message
                      if (availabilityCards.length === 0) {
                        return '<div class="no-availability">No service scheduled for the next 14 days</div>';
                      }

                      return availabilityCards.join("");
                    })()}
                </div>
            </div>
        </div>
        
    `;
  // Add event listeners for seat class tabs
  requestAnimationFrame(() => {
    const tabs = card.querySelectorAll(".seat-class-tab");
    const availabilitySection = card.querySelector(".availability-scroll");

      function updateAvailabilityDisplay(selectedClass) {
      const seatsByClass = {
        AC: availableSeats.ac,
        Sleeper: availableSeats.sleeper,
        General: availableSeats.general,
      };
      const seats = seatsByClass[selectedClass] || 0;
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const today = new Date(journeyDate);
      const availabilityCards = [];

      // Generate next 14 days and filter for running days only
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dayName = daysOfWeek[date.getDay()];

        // Check if train runs on this day
        if (Array.isArray(train.runningDays) && train.runningDays.includes(dayName)) {
          const availability =
            seats > 0 ? `${seats} Seats` : "WL" + Math.floor(Math.random() * 100);

          const statusClass = seats > 0 ? "available" : "waiting";
          
          availabilityCards.push(`
            <div class="availability-card" onclick="selectDate(this, '${date.toISOString()}', '${selectedClass}', ${train.id})">
                <div class="availability-date">
                  ${date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div class="availability-status ${statusClass}">
                  ${availability}
                </div>
            </div>
          `);
        }
      }

      // If no cards were created, show a message
      availabilitySection.innerHTML = availabilityCards.length === 0
        ? '<div class="no-availability">No service scheduled for the next 14 days</div>'
        : availabilityCards.join("");
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Update active tab
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const selectedClass = tab.dataset.class;
        updateAvailabilityDisplay(selectedClass);
      });
    });

    // Initialize with default class (Sleeper)
    updateAvailabilityDisplay("Sleeper");
  });

  return card;
}

// Function to handle ticket booking
function bookTicket(trainId, className, selectedDate = journeyDate) {
  // Store booking details in session storage
  const bookingDetails = {
    trainId,
    class: className,
    from: fromStation,
    to: toStation,
    date: selectedDate,
  };
  sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

  // Redirect to booking page
  window.location.href = "/book-ticket.html";
}

// Function to handle date selection
function selectDate(card, selectedDate, selectedClass, trainId) {
  // Remove selected class from all cards in the same train card
  const trainCard = card.closest(".train-card");
  trainCard.querySelectorAll(".availability-card").forEach((c) => {
    c.classList.remove("selected");
  });

  // Add selected class to clicked card
  card.classList.add("selected");

  // Update the book now button to use selected date and class
  const bookButton = trainCard.querySelector(".book-now-btn");
  bookButton.onclick = () => bookTicket(trainId, selectedClass, selectedDate);
}

// Initial search with URL parameters
if (fromStation && toStation && journeyDate) {
  searchTrains(fromStation, toStation, journeyDate, classType);
}
