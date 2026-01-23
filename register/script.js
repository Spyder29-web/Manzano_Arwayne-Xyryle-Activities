document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.querySelector('.error');

    errorDiv.style.visibility = 'hidden';

    if (username === '') {
        errorDiv.textContent = 'Username is required.';
        errorDiv.style.visibility = 'visible';
        return;
    }

    if (password === '') {
        errorDiv.textContent = 'Password is required.';
        errorDiv.style.visibility = 'visible';
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.visibility = 'visible';
        return;
    }

    errorDiv.style.visibility = 'hidden';
    alert('Registration successful!');

});
