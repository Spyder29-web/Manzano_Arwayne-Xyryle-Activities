function showError(message) {
    const msg = document.getElementById("message");
    if (msg) {
        msg.innerText = message;
    }
}
async function getData() {
    try {
        const response = await fetch('http://localhost/api/student-list.php');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        const tbody = document.querySelector("#studentTable tbody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (Array.isArray(data.students)) {
            data.students.forEach(student => {
    const fullName = `${student.first_name} ${student.last_name}`;

    const row = `
        <tr>
            <td>${student.id}</td>
            <td>${fullName}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.year_level}</td>
            <td>${student.enrollment_date}</td>
        </tr>
    `;
    tbody.innerHTML += row;
});
        } else {
            console.error("Data.students is not an array:", data.students);
        }

    } catch (error) {
        console.error(error);
    }
}
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitData();
});

async function submitData() {
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const data = {
            username: username,
            password: password
        }

        const response = await fetch(
            'http://localhost/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

        const resData = await response.json();

        console.log(resData);

        if(resData.success) {
            showError("Login successful");
            document.getElementById('studentTable').style.display = 'table';
            getData();
        }
        else {
            showError("Login failed");
        }

    } catch(error) {
        showError("Error: " + error.message);
        console.error(error);
    }
}
