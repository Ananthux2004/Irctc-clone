
// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get form elements
    const registerForm = document.getElementById('registerForm');
    
    // Side Menu Elements
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuMains = document.querySelectorAll('.menu-main[data-menu]');
    
    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    
    // Handle register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form data
        const username = document.getElementById('username').value.trim();
        const fullname = document.getElementById('fullname').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        
        // Check if there are any validation errors
        const hasErrors = document.querySelectorAll('.error-message.show').length > 0;
        const hasEmptyFields = !username || !fullname || !password || !confirmPassword || !email || !mobile;
        
        if (hasEmptyFields) {
            alert('Please fill in all fields');
            return;
        }
        
        if (hasErrors) {
            alert('Please fix all validation errors before submitting');
            return;
        }
        
        // For now, just show success message
        const countryCode = document.getElementById('countryCode').value;
        alert('Registration functionality will be connected to backend later!\nUsername: ' + username + '\nFull Name: ' + fullname + '\nEmail: ' + email + '\nMobile: ' + countryCode + ' ' + mobile);
        
        // Clear form and reset validation
        registerForm.reset();
        document.querySelectorAll('.error-message').forEach(error => error.classList.remove('show'));
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('error', 'valid');
        });
        passwordStrength.textContent = '';
    });
    
    // Handle notification button click
    notificationBtn.addEventListener('click', function() {
        alert('Notification feature will be implemented later!');
    });
    
    // Real-time validation
    const usernameInput = document.getElementById('username');
    const fullnameInput = document.getElementById('fullname');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailInput = document.getElementById('email');
    const mobileInput = document.getElementById('mobile');
    
    const usernameError = document.getElementById('username-error');
    const fullnameError = document.getElementById('fullname-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const emailError = document.getElementById('email-error');
    const mobileError = document.getElementById('mobile-error');
    const passwordStrength = document.getElementById('password-strength');
    
    // Username validation
    usernameInput.addEventListener('input', function() {
        const username = this.value.trim();
        
        if (username.length === 0) {
            showError(this, usernameError, 'User Name/Email Id is required.');
        } else if (username.length < 7) {
            showError(this, usernameError, 'Username must be at least 7 characters long.');
        } else if (!/^[a-zA-Z0-9@._-]+$/.test(username)) {
            showError(this, usernameError, 'Username can only contain letters, numbers, @, ., _, and -');
        } else {
            hideError(this, usernameError);
        }
    });
    
    // Full name validation
    fullnameInput.addEventListener('input', function() {
        const fullname = this.value.trim();
        
        if (fullname.length === 0) {
            showError(this, fullnameError, 'Full Name is required.');
        } else if (fullname.length < 2) {
            showError(this, fullnameError, 'Full name must be at least  2 characters long.');
        } else if (!/^[a-zA-Z\s]+$/.test(fullname)) {
            showError(this, fullnameError, 'Full name can only contain letters and spaces.');
        } else {
            hideError(this, fullnameError);
        }
    });
    
    // Password validation
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            showError(this, passwordError, 'Password is required.');
            passwordStrength.textContent = '';
            return;
        }
        
        const validations = validatePassword(password);
        
        if (validations.errors.length > 0) {
            showError(this, passwordError, validations.errors.join(' '));
        } else {
            hideError(this, passwordError);
        }
        
        // Show password strength
        updatePasswordStrength(validations.strength);
    });
    
    // Confirm password validation
    confirmPasswordInput.addEventListener('input', function() {
        const confirmPassword = this.value;
        const password = passwordInput.value;
        
        if (confirmPassword.length === 0) {
            showError(this, confirmPasswordError, 'Confirm password is required.');
        } else if (confirmPassword !== password) {
            showError(this, confirmPasswordError, 'Passwords do not match.');
        } else {
            hideError(this, confirmPasswordError);
        }
    });
    
    // Also check confirm password when main password changes
    passwordInput.addEventListener('input', function() {
        // Existing password validation code...
        const password = this.value;
        
        if (password.length === 0) {
            showError(this, passwordError, 'Password is required.');
            passwordStrength.textContent = '';
            return;
        }
        
        const validations = validatePassword(password);
        
        if (validations.errors.length > 0) {
            showError(this, passwordError, validations.errors.join(' '));
        } else {
            hideError(this, passwordError);
        }
        
        // Show password strength
        updatePasswordStrength(validations.strength);
        
        // Recheck confirm password if it has a value
        const confirmPassword = confirmPasswordInput.value;
        if (confirmPassword.length > 0) {
            if (confirmPassword !== password) {
                showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match.');
            } else {
                hideError(confirmPasswordInput, confirmPasswordError);
            }
        }
    });
    
    // Email validation
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        
        if (email.length === 0) {
            showError(this, emailError, 'Email is required.');
        } else if (email.length < 10) {
            showError(this, emailError, 'Please provide correct Email ID. Email Min 10 character & Max 70 character.');
        } else if (email.length > 70) {
            showError(this, emailError, 'Please provide correct Email ID. Email Min 10 character & Max 70 character.');
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            showError(this, emailError, 'Please provide correct Email ID.');
        } else {
            hideError(this, emailError);
        }
    });
    
    // Mobile validation
    mobileInput.addEventListener('input', function() {
        const mobile = this.value.trim();
        
        if (mobile.length === 0) {
            showError(this, mobileError, 'Mobile No is required.');
        } else if (!/^\d{10}$/.test(mobile)) {
            showError(this, mobileError, 'Mobile number must be exactly 10 digits.');
        } else {
            hideError(this, mobileError);
        }
    });
    
    function validatePassword(password) {
        const errors = [];
        let strength = 'weak';
        
        if (password.length < 11) {
            errors.push('Password must be at least 11 characters long.');
        }
        if (password.length > 15) {
            errors.push('Password must not exceed 15 characters.');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number.');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).');
        }
        
        // Calculate strength
        if (errors.length === 0) {
            if (password.length >= 13 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                strength = 'strong';
            } else if (password.length >= 11) {
                strength = 'medium';
            }
        }
        
        return { errors, strength };
    }
    
    function updatePasswordStrength(strength) {
        passwordStrength.className = 'password-strength ' + strength;
        passwordStrength.textContent = 'Password Strength: ' + strength.charAt(0).toUpperCase() + strength.slice(1);
    }
    
    function showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('valid');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function hideError(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorElement.classList.remove('show');
    }
    
    // Add some visual feedback for input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Side Menu Functionality
    menuToggle.addEventListener('click', function() {
        toggleMenu();
    });
    
    menuOverlay.addEventListener('click', function() {
        closeMenu();
    });
    
    // Handle dropdown menus
    menuMains.forEach(menuMain => {
        menuMain.addEventListener('click', function() {
            const menuType = this.getAttribute('data-menu');
            const submenu = document.getElementById(menuType + '-submenu');
            
            // Close other submenus
            document.querySelectorAll('.submenu.active').forEach(sm => {
                if (sm !== submenu) {
                    sm.classList.remove('active');
                    sm.parentElement.querySelector('.menu-main').classList.remove('active');
                }
            });
            
            // Toggle current submenu
            submenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    });
    
    function toggleMenu() {
        sideMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
    
    function closeMenu() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        
        // Close all submenus
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
            submenu.parentElement.querySelector('.menu-main').classList.remove('active');
        });
    }
});
