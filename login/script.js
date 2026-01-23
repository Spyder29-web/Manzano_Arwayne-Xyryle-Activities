function registerUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageBox = document.getElementById("messageBox");

    if (password !== confirmPassword) {
        messageBox.innerHTML = "<div class='error'>Ulitem boy</div>";
        return;
    }

    messageBox.innerHTML = "<div class='success'>Nice one boyyy!!</div>";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
}

function goBack() {
    alert("Back button clicked!");
}
