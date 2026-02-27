// User credentials database
const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    { username: 'user', password: 'user123', role: 'user', name: 'Regular User' },
    { username: 'manager', password: 'manager123', role: 'manager', name: 'Manager' }
];

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    checkExistingSession();
    setupFormValidation();
});

// Check if user is already logged in
function checkExistingSession() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        redirectToDashboard();
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'text' && value.length < 3) {
        isValid = false;
        errorMessage = 'Username must be at least 3 characters';
    } else if (field.type === 'password' && value.length < 6) {
        isValid = false;
        errorMessage = 'Password must be at least 6 characters';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate all fields
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    const isUsernameValid = validateField(usernameField);
    const isPasswordValid = validateField(passwordField);
    
    if (!isUsernameValid || !isPasswordValid) {
        showAlert('Please fix the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    const loginButton = document.querySelector('.btn-login');
    const originalText = loginButton.innerHTML;
    loginButton.innerHTML = '<span class="loading"></span> Signing in...';
    loginButton.disabled = true;
    
    // Simulate authentication delay
    setTimeout(() => {
        const user = authenticateUser(username, password);
        
        if (user) {
            // Successful login
            loginUser(user, remember);
            showAlert('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                redirectToDashboard();
            }, 1000);
        } else {
            // Failed login
            showAlert('Invalid username or password', 'error');
            loginButton.innerHTML = originalText;
            loginButton.disabled = false;
            
            // Shake animation for form
            const form = document.getElementById('loginForm');
            form.style.animation = 'shake 0.5s';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        }
    }, 1000);
}

// Authenticate user
function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

// Login user and create session
function loginUser(user, remember) {
    const sessionData = {
        username: user.username,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
    };
    
    if (remember) {
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
    }
    
    // Update last login
    const lastLogin = {
        username: user.username,
        loginTime: sessionData.loginTime
    };
    localStorage.setItem('lastLogin', JSON.stringify(lastLogin));
}

// Redirect to dashboard
function redirectToDashboard() {
    window.location.href = 'index.html';
}

// Toggle password visibility
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordField.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Fill demo credentials
function fillDemoCredentials(type) {
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    let username, password;
    
    switch(type) {
        case 'admin':
            username = 'admin';
            password = 'admin123';
            break;
        case 'user':
            username = 'user';
            password = 'user123';
            break;
        default:
            username = 'user';
            password = 'user123';
    }
    
    // Animate the filling
    usernameField.value = '';
    passwordField.value = '';
    
    setTimeout(() => {
        usernameField.value = username;
        usernameField.dispatchEvent(new Event('input'));
    }, 100);
    
    setTimeout(() => {
        passwordField.value = password;
        passwordField.dispatchEvent(new Event('input'));
    }, 300);
    
    showAlert(`Demo credentials filled: ${username}`, 'info');
}

// Show forgot password modal
function showForgotPassword() {
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    modal.show();
}

// Handle forgot password
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    const username = document.getElementById('resetUsername').value.trim();
    
    if (!email || !username) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user exists
    const user = users.find(u => u.username === username);
    
    if (user) {
        showAlert(`Password reset link sent to ${email}`, 'success');
        
        // Close modal after delay
        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
            document.getElementById('forgotPasswordForm').reset();
        }, 2000);
    } else {
        showAlert('Username not found', 'error');
    }
}

// Show alert message
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    
    const alert = document.createElement('div');
    alert.className = `alert-custom alert-${type}`;
    
    let icon = '';
    switch(type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        case 'info':
            icon = 'fas fa-info-circle';
            break;
    }
    
    alert.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 5000);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit form
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const form = document.getElementById('loginForm');
        if (form) {
            handleLogin(e);
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            bootstrap.Modal.getInstance(modal).hide();
        });
    }
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
