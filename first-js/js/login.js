function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username.length === 0) {
        alert("Username and Password is required");
    }

    if ((username === 'admin') && (password === '12345') ) {
        alert("Login Successful");
    }
}