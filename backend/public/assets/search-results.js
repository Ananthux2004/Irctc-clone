// Function to handle booking and redirect
function bookTicket(trainId, selectedClass, selectedDate, price) {
  // Store booking details in session storage
  const bookingDetails = {
    trainId: trainId,
    class: selectedClass,
    from: fromStation,
    to: toStation,
    date: selectedDate,
    price: price,
  };
  console.log("Storing booking details:", bookingDetails);
  sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

  // Build URL parameters
  const searchParams = new URLSearchParams({
    trainId: trainId,
    from: fromStation,
    to: toStation,
    date: selectedDate,
    class:
      selectedClass === "Sleeper" ? "SL" : selectedClass === "AC" ? "3A" : "SL",
    price: price,
  });

  // Redirect to booking page
  window.location.href = `/book-ticket.html?${searchParams.toString()}`;
}

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const fromStation = urlParams.get("from");
const toStation = urlParams.get("to");
const journeyDate = urlParams.get("date");
const classType = urlParams.get("class") || "All Classes";

// Define default prices for each class
const defaultPrices = {
  AC: 1000,
  Sleeper: 400,
  General: 200,
};

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
                      const daysOfWeek = [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ];

                      // Generate next 14 days and filter for running days only
                      for (let i = 0; i < 14; i++) {
                        const date = new Date(today);
                        date.setDate(date.getDate() + i);
                        const dayName = daysOfWeek[date.getDay()];

                        // Check if train runs on this day
                        if (
                          Array.isArray(train.runningDays) &&
                          train.runningDays.includes(dayName)
                        ) {
                          // Default to Sleeper class for initial display
                          const seats = availableSeats.sleeper;

                          const availability =
                            seats > 0
                              ? `${seats} Seats`
                              : "WL" + Math.floor(Math.random() * 100); // Simulated waitlist

                          const statusClass =
                            seats > 0 ? "available" : "waiting";

                          availabilityCards.push(`
                                <div class="availability-card" data-date="${date.toISOString()}" data-train-id="${
                            train.id
                          }">
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
  // Add event listeners for seat class tabs and availability cards
  requestAnimationFrame(() => {
    const tabs = card.querySelectorAll(".seat-class-tab");
    const availabilitySection = card.querySelector(".availability-scroll");

    // Add click handlers for availability cards
    card.querySelectorAll(".availability-card").forEach((availCard) => {
      availCard.addEventListener("click", () => {
        const date = availCard.dataset.date;
        const trainId = availCard.dataset.trainId;
        const currentClass = card.querySelector(".seat-class-tab.active")
          .dataset.class;
        selectDate(availCard, date, currentClass, trainId);
      });
    });

    function updateAvailabilityDisplay(selectedClass) {
      // Get both seats and prices for each class
      // Get seats and prices for each class
      const seatsByClass = {
        AC: availableSeats.ac,
        Sleeper: availableSeats.sleeper,
        General: availableSeats.general,
      };

      // Map prices from the train data
      const pricesByClass = {
        AC: train.price?.ac || defaultPrices.AC,
        Sleeper: train.price?.sleeper || defaultPrices.Sleeper,
        General: train.price?.general || defaultPrices.General,
      };

      console.log("Price mapping details:", {
        selectedClass,
        trainPrices: train.price,
        mappedPrices: pricesByClass,
        actualPrice: pricesByClass[selectedClass],
        defaultPrices,
      });
      const seats = seatsByClass[selectedClass] || 0;
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const today = new Date(journeyDate);
      availabilitySection.innerHTML = ""; // Clear existing cards

      // Generate next 14 days and filter for running days only
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dayName = daysOfWeek[date.getDay()];

        // Check if train runs on this day
        if (
          Array.isArray(train.runningDays) &&
          train.runningDays.includes(dayName)
        ) {
          const availability =
            seats > 0
              ? `${seats} Seats`
              : "WL" + Math.floor(Math.random() * 100);

          const statusClass = seats > 0 ? "available" : "waiting";

          const card = document.createElement("div");
          card.className = "availability-card";
          card.dataset.date = date.toISOString();
          card.dataset.trainId = train.id;
          card.dataset.class = selectedClass;

          card.innerHTML = `
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
          `;

          // Add click handler directly to the element
          // Get the actual price from train document
          const classMapping = {
            Sleeper: "sleeper",
            AC: "ac",
            General: "general",
          };
          const dbField = classMapping[selectedClass];
          const actualPrice =
            train.price?.[dbField] || defaultPrices[selectedClass];
          card.dataset.price = actualPrice;

          console.log("Setting price for class:", {
            class: selectedClass,
            mappedClass: dbField,
            price: actualPrice,
            dbPrice: train.price?.[dbField],
            defaultPrice: defaultPrices[selectedClass],
            trainPrices: train.price,
          });

          card.addEventListener("click", function () {
            console.log("Card clicked:", {
              date: this.dataset.date,
              class: this.dataset.class,
              trainId: this.dataset.trainId,
              price: actualPrice,
            });
            selectDate(
              this,
              this.dataset.date,
              this.dataset.class,
              this.dataset.trainId,
              this.dataset.price
            );
          });

          // Directly append the card to the section instead of using innerHTML
          availabilitySection.appendChild(card);
        }
      }

      // If no cards were created, show a message
      if (!availabilitySection.hasChildNodes()) {
        availabilitySection.innerHTML =
          '<div class="no-availability">No service scheduled for the next 14 days</div>';
      }
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

// Function to handle direct booking
function handleDirectBooking(trainId, selectedClass, price, date) {
  const bookingDetails = {
    trainId,
    class: selectedClass,
    from: fromStation,
    to: toStation,
    date: date,
    price: price,
  };

  sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

  const classMapping = {
    Sleeper: "SL",
    AC: "3A",
    General: "SL",
  };

  const searchParams = new URLSearchParams({
    trainId,
    from: fromStation,
    to: toStation,
    date: date,
    class: classMapping[selectedClass] || "SL",
    price: price,
  });

  window.location.href = `/book-ticket.html?${searchParams.toString()}`;
}

// Store selected card information globally for each train card
const selectedAvailability = new Map();

// Function to handle date selection
function selectDate(card, selectedDate, selectedClass, trainId, price) {
  console.log("Date selection:", {
    selectedDate,
    selectedClass,
    trainId,
    price,
  });

  const trainCard = card.closest(".train-card");

  // Store selection state
  selectedAvailability.set(trainId, {
    date: selectedDate,
    class: selectedClass,
    cardElement: card,
    price: price,
  });

  // Update visual selection
  trainCard.querySelectorAll(".availability-card").forEach((c) => {
    c.classList.remove("selected");
    c.setAttribute("aria-selected", "false");
  });

  // Add selected class and aria attributes
  card.classList.add("selected");
  card.setAttribute("aria-selected", "true");

  console.log("Selection stored:", selectedAvailability.get(trainId));

  // Fetch fresh train data to get current prices
  fetch(`/api/trains/${trainId}`)
    .then((response) => response.json())
    .then((trainData) => {
      const classMapping = {
        Sleeper: "sleeper",
        AC: "ac",
        General: "general",
      };

      // Get actual price from train data
      const dbField = classMapping[selectedClass];
      const actualPrice =
        trainData.price?.[dbField] || defaultPrices[selectedClass];

      console.log("Fetched train data:", {
        trainId,
        class: selectedClass,
        mappedClass: dbField,
        price: actualPrice,
        dbPrice: trainData.price?.[dbField],
        defaultPrice: defaultPrices[selectedClass],
        trainPrices: trainData.price,
      });

      // Update the book now button with actual price
      const bookButton = trainCard.querySelector(".book-now-btn");
      bookButton.textContent = `Book ${selectedClass} Class - ₹${actualPrice}`;
      bookButton.disabled = false;

      // Store the booking data with actual price
      bookButton.dataset.trainId = trainId;
      bookButton.dataset.selectedClass = selectedClass;
      bookButton.dataset.selectedDate = selectedDate;
      bookButton.dataset.price = actualPrice;

      // Set up the click handler for booking
      bookButton.onclick = function () {
        bookTicket(trainId, selectedClass, selectedDate, actualPrice);
      };

      // Also update the stored selection with actual price
      selectedAvailability.set(trainId, {
        date: selectedDate,
        class: selectedClass,
        cardElement: card,
        price: actualPrice,
      });
    })
    .catch((error) => {
      console.error("Error fetching train details:", error);
    });

  // Remove any existing click handler
  if (bookButton.clickHandler) {
    bookButton.removeEventListener("click", bookButton.clickHandler);
  }

  bookButton.clickHandler = () => {
    console.log("Book button clicked:", {
      trainId: bookButton.dataset.trainId,
      class: bookButton.dataset.selectedClass,
      date: bookButton.dataset.selectedDate,
      price: bookButton.dataset.price,
    });

    const bookingDetails = {
      trainId: bookButton.dataset.trainId,
      class: bookButton.dataset.selectedClass,
      from: fromStation,
      to: toStation,
      date: bookButton.dataset.selectedDate,
      price: bookButton.dataset.price,
    };

    sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    const searchParams = new URLSearchParams({
      trainId: bookButton.dataset.trainId,
      from: fromStation,
      to: toStation,
      date: bookButton.dataset.selectedDate,
      class:
        bookButton.dataset.selectedClass === "Sleeper"
          ? "SL"
          : bookButton.dataset.selectedClass === "AC"
          ? "3A"
          : "SL",
      price: bookButton.dataset.price,
    });

    window.location.href = `/book-ticket.html?${searchParams.toString()}`;
  };
  bookButton.addEventListener("click", bookButton.clickHandler);
}

// Initial search with URL parameters
if (fromStation && toStation && journeyDate) {
  searchTrains(fromStation, toStation, journeyDate, classType);
}
