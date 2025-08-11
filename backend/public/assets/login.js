// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Basic validation
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        // Show login attempt (for demonstration)
        alert(
            "Login Attempt:\n" +
            "Username: " + username + "\n" +
            "Password: " + "*".repeat(password.length)
        );

        // Clear form
        loginForm.reset();

        // Redirect to home page
        window.location.href = '/index.html';
    });

    // Add field validation
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Username validation
    usernameInput.addEventListener('input', function() {
        const username = this.value.trim();
        if (username.length === 0) {
            this.classList.add('error');
            this.classList.remove('valid');
        } else {
            this.classList.add('valid');
            this.classList.remove('error');
        }
    });

    // Password validation
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        if (password.length === 0) {
            this.classList.add('error');
            this.classList.remove('valid');
        } else {
            this.classList.add('valid');
            this.classList.remove('error');
        }
    });
});
