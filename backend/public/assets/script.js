document.addEventListener("DOMContentLoaded", function () {
  // Get navigation elements
  const homeLink = document.getElementById("homeLink");
  const loginLink = document.getElementById("loginLink");

  // Get ticket menu items
  const bookTickets = document.getElementById("bookTickets");
  const viewTrains = document.getElementById("viewTrains");
  const cancelTicket = document.getElementById("cancelTicket");

  // Side Menu Elements
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuMains = document.querySelectorAll(".menu-main[data-menu]");

  // Handle navigation clicks
  if (homeLink) {
    homeLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "index.html";
    });
  }

  // Handle ticket menu items
  if (bookTickets) {
    bookTickets.addEventListener("click", function (e) {
      e.preventDefault();
      if (!isLoggedIn()) {
        window.location.href = "login.html";
        return;
      }
      showContent("bookTickets");
      closeMenu();
    });
  }

  if (viewTrains) {
    viewTrains.addEventListener("click", function (e) {
      e.preventDefault();
      if (!isLoggedIn()) {
        window.location.href = "login.html";
        return;
      }
      showContent("viewTrains");
      closeMenu();
    });
  }

  if (cancelTicket) {
    cancelTicket.addEventListener("click", function (e) {
      e.preventDefault();
      if (!isLoggedIn()) {
        window.location.href = "login.html";
        return;
      }
      showContent("cancelTicket");
      closeMenu();
    });
  }

  // Add some visual feedback for input fields
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });
  });

  // Side Menu Functionality
  menuToggle.addEventListener("click", function () {
    toggleMenu();
  });

  menuOverlay.addEventListener("click", function () {
    closeMenu();
  });

  // Handle dropdown menus
  menuMains.forEach((menuMain) => {
    menuMain.addEventListener("click", function () {
      const menuType = this.getAttribute("data-menu");
      const submenu = document.getElementById(menuType + "-submenu");

      // Close other submenus
      document.querySelectorAll(".submenu.active").forEach((sm) => {
        if (sm !== submenu) {
          sm.classList.remove("active");
          sm.parentElement
            .querySelector(".menu-main")
            .classList.remove("active");
        }
      });

      // Toggle current submenu
      submenu.classList.toggle("active");
      this.classList.toggle("active");
    });
  });

  function toggleMenu() {
    sideMenu.classList.toggle("active");
    menuOverlay.classList.toggle("active");
    menuToggle.classList.toggle("active");
  }

  function closeMenu() {
    sideMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    menuToggle.classList.remove("active");

    // Reset all arrows and submenus
    document.querySelectorAll(".submenu.active").forEach((submenu) => {
      submenu.classList.remove("active");
      const menuMain = submenu.parentElement.querySelector(".menu-main");
      if (menuMain) {
        menuMain.classList.remove("active");
        const arrow = menuMain.querySelector(".arrow");
        if (arrow) {
          arrow.style.transform = "rotate(0deg)";
        }
      }
    });
  }

  function isLoggedIn() {
    return true; 
  }

  function showContent(section) {
    const mainContent = document.querySelector(".main-content");

    // Clear current content
    mainContent.innerHTML = "";

    switch (section) {
      case "home":
        mainContent.innerHTML =
          "<h2>Welcome to IRCTC Clone</h2><p>Choose an option from the menu to get started.</p>";
        break;

      case "bookTickets":
        mainContent.innerHTML = `
                    <div class="form-container">
                        <h2>Book Train Tickets</h2>
                        <form id="bookingForm" class="booking-form">
                            <div class="input-group">
                                <label for="from">From Station</label>
                                <input type="text" id="from" name="from" required>
                            </div>
                            <div class="input-group">
                                <label for="to">To Station</label>
                                <input type="text" id="to" name="to" required>
                            </div>
                            <div class="input-group">
                                <label for="date">Date of Journey</label>
                                <input type="date" id="date" name="date" required>
                            </div>
                            <button type="submit" class="submit-btn">Search Trains</button>
                        </form>
                    </div>
                `;
        break;

      case "viewTrains":
        mainContent.innerHTML = `
                    <div class="trains-container">
                        <h2>Available Trains</h2>
                        <div class="trains-list">
                            <p>Please search for trains using the Book Tickets option.</p>
                        </div>
                    </div>
                `;
        break;

      case "cancelTicket":
        mainContent.innerHTML = `
                    <div class="form-container">
                        <h2>Cancel Ticket</h2>
                        <form id="cancelForm" class="cancel-form">
                            <div class="input-group">
                                <label for="pnr">PNR Number</label>
                                <input type="text" id="pnr" name="pnr" required>
                            </div>
                            <button type="submit" class="submit-btn">Search Ticket</button>
                        </form>
                    </div>
                `;
        break;

      case "login":
        mainContent.innerHTML = `
                    <div class="form-container">
                        <h2>Login to Your Account</h2>
                        <form id="loginForm" class="login-form">
                            <div class="input-group">
                                <label for="username">Username/Email</label>
                                <input type="text" id="username" name="username" required>
                            </div>
                            <div class="input-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <button type="submit" class="login-btn">Login</button>
                            <div class="form-links">
                                <a href="#" class="link">Forgot Password?</a>
                                <span>|</span>
                                <a href="#" class="link" id="showRegister">New User? Register</a>
                            </div>
                        </form>
                    </div>
                `;
        break;
    }

    // Reattach event listeners if needed
    if (section === "login") {
      const newLoginForm = document.getElementById("loginForm");
      const newShowRegisterLink = document.getElementById("showRegister");

      if (newLoginForm) {
        newLoginForm.addEventListener("submit", handleLoginSubmit);
      }
      if (newShowRegisterLink) {
        newShowRegisterLink.addEventListener("click", function (e) {
          e.preventDefault();
          window.location.href = "register.html";
        });
      }
    }
  }

  // Handle login form submission
  function handleLoginSubmit(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    alert(
      "Login functionality will be connected to backend later!\nUsername: " +
        username
    );
    this.reset();
  }
});
