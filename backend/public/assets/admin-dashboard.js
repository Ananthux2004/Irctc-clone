document.addEventListener("DOMContentLoaded", function () {
  // Authentication check
  const checkAdminAuth = async () => {
    try {
      const response = await fetch("/api/users/check-auth");
      const data = await response.json();
      if (!data.isAuthenticated || !data.isAdmin) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      window.location.href = "/login.html";
    }
  };

  // Navigation
  const sidebarLinks = document.querySelectorAll(".sidebar-nav li");
  const pages = document.querySelectorAll(".page");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetPage = link.getAttribute("data-page");

      // Update active state
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Show/hide pages
      pages.forEach((page) => {
        page.classList.add("hidden");
        if (page.id === targetPage) {
          page.classList.remove("hidden");
        }
      });
    });
  });

  // Initialize modals
  const addTrainModal = document.getElementById('addTrainModal');
  const viewTrainModal = document.getElementById('viewTrainModal');
  const editTrainModal = document.getElementById('editTrainModal');

  // Modal handling for Add Train
  const addTrainBtn = document.getElementById('addNewTrainBtn');
  const addCloseBtn = addTrainModal.querySelector('.close-modal');
  const addCancelBtn = addTrainModal.querySelector('.cancel-btn');

  addTrainBtn.addEventListener('click', () => {
    addTrainModal.style.display = 'block';
  });

  [addCloseBtn, addCancelBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      addTrainModal.style.display = 'none';
    });
  });

  // Load trains
  const loadTrains = async () => {
    try {
      const response = await fetch("/api/trains/all");
      const trains = await response.json();
      const trainList = document.getElementById("trainList");

      trainList.innerHTML = trains
        .map(
          (train) => `
                <tr>
                    <td>${train.trainName}</td>
                    <td>#${train.trainNumber}</td>
                    <td>${train.source} - ${train.destination}</td>
                    <td>Daily<br>${train.departureTime} - ${
            train.arrivalTime
          }</td>
                    <td>
                        <span class="status-${
                          train.status === "Delayed" ? "delayed" : "on-time"
                        }">
                            ${train.status || "On Time"}
                        </span>
                    </td>
                    <td>${
                      train.availableSeats.sleeper +
                      train.availableSeats.ac +
                      train.availableSeats.general
                    } Coaches</td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn" onclick="viewTrain('${
                              train._id
                            }')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn" onclick="editTrain('${
                              train._id
                            }')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn" onclick="deleteTrain('${
                              train._id
                            }')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `
        )
        .join("");
    } catch (error) {
      console.error("Error loading trains:", error);
    }
  };

  // Load users
  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users/all");
      const users = await response.json();
      const usersList = document.getElementById("usersList");

      usersList.innerHTML = users
        .map(
          (user) => `
                <div class="user-card ${user.isAdmin ? "admin-card" : ""}">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                        ${
                          user.isAdmin
                            ? '<span class="admin-badge">Admin</span>'
                            : ""
                        }
                    </div>
                    <div class="user-info">
                        <h3>${user.fullname || "N/A"}</h3>
                        <div class="user-details">
                            <p><i class="fas fa-envelope"></i> ${user.email}</p>
                            <p><i class="fas fa-user"></i> ${user.username}</p>
                            <p><i class="fas fa-phone"></i> ${
                              user.countryCode || "+91"
                            }${user.mobile || "N/A"}</p>
                        </div>
                        <div class="user-stats">
                            <div class="stat">
                                <span class="stat-value">${
                                  user.bookings?.length || 0
                                }</span>
                                <span class="stat-label">Bookings</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">${
                                  user.lastLogin
                                    ? new Date(
                                        user.lastLogin
                                      ).toLocaleDateString()
                                    : "Never"
                                }</span>
                                <span class="stat-label">Last Login</span>
                            </div>
                        </div>
                    </div>
                    <div class="user-actions">
                        <button class="action-btn view-btn" onclick="viewUserDetails('${
                          user._id
                        }')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${
                          !user.isAdmin
                            ? `
                            <button class="action-btn delete-btn" onclick="deleteUser('${user._id}')" title="Delete User">
                                <i class="fas fa-trash"></i>
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>
            `
        )
        .join("");
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  // Add new train
  document
    .getElementById("addTrainForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const daysChecked = Array.from(
        document.querySelectorAll(
          '#addTrainForm .days-selection input[type="checkbox"]:checked'
        )
      ).map((checkbox) => checkbox.value);

      const trainData = {
        trainName: document.getElementById("trainName").value,
        trainNumber: document.getElementById("trainNumber").value,
        source: document.getElementById("source").value,
        destination: document.getElementById("destination").value,
        departureTime: document.getElementById("departureTime").value,
        arrivalTime: document.getElementById("arrivalTime").value,
        availableSeats: {
          sleeper: parseInt(document.getElementById("sleeperSeats").value),
          ac: parseInt(document.getElementById("acSeats").value),
          general: parseInt(document.getElementById("generalSeats").value),
        },
        price: {
          sleeper: parseInt(document.getElementById("sleeperPrice").value),
          ac: parseInt(document.getElementById("acPrice").value),
          general: parseInt(document.getElementById("generalPrice").value),
        },
        daysOfOperation: daysChecked,
      };

      try {
        const response = await fetch("/api/trains/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trainData),
        });

        if (response.ok) {
          addTrainModal.style.display = "none";
          loadTrains();
          e.target.reset();
        } else {
          const error = await response.json();
          alert("Error adding train: " + error.message);
        }
      } catch (error) {
        console.error("Error adding train:", error);
        alert("Error adding train");
      }
    });

  // Edit train
  window.editTrain = async (trainId) => {
    try {
      const response = await fetch(`/api/trains/${trainId}`);
      const train = await response.json();
      
      const editTrainModal = document.getElementById('editTrainModal');
      const modalBody = editTrainModal.querySelector('.modal-body');

      modalBody.innerHTML = `
        <form id="editTrainForm">
          <input type="hidden" id="editTrainId" value="${train._id}">
          <div class="form-row">
            <div class="form-group">
              <label for="editTrainName">Train Name</label>
              <input type="text" id="editTrainName" value="${train.trainName}" required>
            </div>
            <div class="form-group">
              <label for="editTrainNumber">Train Number</label>
              <input type="text" id="editTrainNumber" value="${train.trainNumber}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="editSource">Source Station</label>
              <input type="text" id="editSource" value="${train.source}" required>
            </div>
            <div class="form-group">
              <label for="editDestination">Destination Station</label>
              <input type="text" id="editDestination" value="${train.destination}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="editDepartureTime">Departure Time</label>
              <input type="time" id="editDepartureTime" value="${train.departureTime}" required>
            </div>
            <div class="form-group">
              <label for="editArrivalTime">Arrival Time</label>
              <input type="time" id="editArrivalTime" value="${train.arrivalTime}" required>
            </div>
          </div>
          <div class="seats-section">
            <h3>Seat Configuration</h3>
            <div class="form-row three-columns">
              <div class="form-group">
                <label for="editSleeperSeats">Sleeper Seats</label>
                <input type="number" id="editSleeperSeats" value="${train.availableSeats.sleeper}" required>
                <label for="editSleeperPrice">Price (₹)</label>
                <input type="number" id="editSleeperPrice" value="${train.price.sleeper}" required>
              </div>
              <div class="form-group">
                <label for="editAcSeats">AC Seats</label>
                <input type="number" id="editAcSeats" value="${train.availableSeats.ac}" required>
                <label for="editAcPrice">Price (₹)</label>
                <input type="number" id="editAcPrice" value="${train.price.ac}" required>
              </div>
              <div class="form-group">
                <label for="editGeneralSeats">General Seats</label>
                <input type="number" id="editGeneralSeats" value="${train.availableSeats.general}" required>
                <label for="editGeneralPrice">Price (₹)</label>
                <input type="number" id="editGeneralPrice" value="${train.price.general}" required>
              </div>
            </div>
          </div>
          <div class="days-section">
            <h3>Days of Operation</h3>
            <div class="days-selection">
              ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                .map(day => `
                  <label class="day-checkbox">
                    <input type="checkbox" value="${day}" ${train.daysOfOperation.includes(day) ? 'checked' : ''}>
                    ${day}
                  </label>
                `).join('')}
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Update Train</button>
          </div>
        </form>
      `;
      
      editTrainModal.style.display = 'block';

      // Close modal functionality
      const closeBtn = editTrainModal.querySelector('.close-modal');
      const cancelBtn = editTrainModal.querySelector('.cancel-btn');
      [closeBtn, cancelBtn].forEach(btn => {
        btn.onclick = () => editTrainModal.style.display = 'none';
      });

      // Form submission
      const form = editTrainModal.querySelector('#editTrainForm');
      form.onsubmit = async (e) => {
        e.preventDefault();
        
        const trainData = {
          trainName: document.getElementById('editTrainName').value,
          trainNumber: document.getElementById('editTrainNumber').value,
          source: document.getElementById('editSource').value,
          destination: document.getElementById('editDestination').value,
          departureTime: document.getElementById('editDepartureTime').value,
          arrivalTime: document.getElementById('editArrivalTime').value,
          availableSeats: {
            sleeper: parseInt(document.getElementById('editSleeperSeats').value),
            ac: parseInt(document.getElementById('editAcSeats').value),
            general: parseInt(document.getElementById('editGeneralSeats').value)
          },
          price: {
            sleeper: parseInt(document.getElementById('editSleeperPrice').value),
            ac: parseInt(document.getElementById('editAcPrice').value),
            general: parseInt(document.getElementById('editGeneralPrice').value)
          },
          daysOfOperation: Array.from(
            editTrainModal.querySelectorAll('.days-selection input:checked')
          ).map(cb => cb.value)
        };

        try {
          const response = await fetch(`/api/trains/${trainId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainData)
          });

          if (response.ok) {
            editTrainModal.style.display = 'none';
            loadTrains();
          } else {
            const error = await response.json();
            alert('Error updating train: ' + error.message);
          }
        } catch (error) {
          console.error('Error updating train:', error);
          alert('Error updating train');
        }
      };
    } catch (error) {
      console.error("Error loading train details:", error);
      alert("Error loading train details");
    }
  };

  // Delete train
  window.deleteTrain = async (trainId) => {
    if (!confirm("Are you sure you want to delete this train?")) return;

    try {
      const response = await fetch(`/api/trains/${trainId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadTrains();
      } else {
        alert("Error deleting train");
      }
    } catch (error) {
      console.error("Error deleting train:", error);
      alert("Error deleting train");
    }
  };

  // Delete user
  window.deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadUsers();
      } else {
        alert("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  // View train
  window.viewTrain = async (trainId) => {
    try {
      const response = await fetch(`/api/trains/${trainId}`);
      const train = await response.json();

      const viewTrainModal = document.getElementById('viewTrainModal');
      const modalBody = viewTrainModal.querySelector('.modal-body');
      
      modalBody.innerHTML = `
        <div class="train-info">
          <div class="train-header">
            <h3>${train.trainName} <span class="train-number">#${train.trainNumber}</span></h3>
            <span class="status-${train.status === "Delayed" ? "delayed" : "on-time"}">
              ${train.status || "On Time"}
            </span>
          </div>
          
          <div class="route-info">
            <div class="station source">
              <label>Source</label>
              <h4>${train.source}</h4>
              <p class="time">${train.departureTime}</p>
            </div>
            <div class="route-line">
              <span class="dot"></span>
              <span class="line"></span>
              <span class="dot"></span>
            </div>
            <div class="station destination">
              <label>Destination</label>
              <h4>${train.destination}</h4>
              <p class="time">${train.arrivalTime}</p>
            </div>
          </div>

          <div class="seats-info">
            <h3>Available Seats & Pricing</h3>
            <div class="seats-grid">
              <div class="seat-type">
                <h4>Sleeper Class</h4>
                <p class="seats">${train.availableSeats.sleeper} seats</p>
                <p class="price">₹${train.price.sleeper}</p>
              </div>
              <div class="seat-type">
                <h4>AC Class</h4>
                <p class="seats">${train.availableSeats.ac} seats</p>
                <p class="price">₹${train.price.ac}</p>
              </div>
              <div class="seat-type">
                <h4>General Class</h4>
                <p class="seats">${train.availableSeats.general} seats</p>
                <p class="price">₹${train.price.general}</p>
              </div>
            </div>
          </div>

          <div class="schedule-info">
            <h3>Running Schedule</h3>
            <div class="days-grid">
              ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                .map(day => `
                  <div class="day-item ${train.daysOfOperation.includes(day) ? 'active' : ''}">
                    ${day.slice(0, 3)}
                  </div>
                `).join('')}
            </div>
          </div>
        </div>
      `;

      viewTrainModal.style.display = "block";

      // Close modal functionality 
      const closeBtn = viewTrainModal.querySelector('.close-modal');
      closeBtn.onclick = () => viewTrainModal.style.display = 'none';

      // Close on outside click
      viewTrainModal.onclick = (e) => {
        if (e.target === viewTrainModal) {
          viewTrainModal.style.display = 'none';
        }
      };
    } catch (error) {
      console.error("Error fetching train details:", error);
      alert("Error loading train details");
    }
  };

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" });
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  });

  // Initial load
  checkAdminAuth();
  loadTrains();
  loadUsers();
});
