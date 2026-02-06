const students = [
  { name: "Ana", scores: [85, 90, 88], present: true },
  { name: "Ben", scores: [70, 75, 72], present: false },
  { name: "Cara", scores: [95, 92, 94], present: true },
  { name: "Daniel", scores: [60, 65, 70], present: true },
  { name: "Ella", scores: [88, 85, 90], present: true },
  { name: "Felix", scores: [78, 80, 82], present: false },
  { name: "Grace", scores: [92, 89, 94], present: true },
  { name: "Hannah", scores: [73, 70, 68], present: false },
  { name: "Ivan", scores: [81, 84, 79], present: true },
  { name: "Julia", scores: [96, 98, 97], present: true }
];

const tableBody = document.getElementById('tableBody');

// Helper function to calculate average using a loop
function calculateAverage(scores) {
    let total = 0;
    for (let i = 0; i < scores.length; i++) {
        total += scores[i];
    }
    return total / scores.length;
}

function renderTable(dataList) {
    tableBody.innerHTML = ""; 

    for (const student of dataList) {
        const avg = calculateAverage(student.scores).toFixed(2);
        const remark = avg >= 75 ? "Passed" : "Failed";
        const remarkClass = remark === "Passed" ? "pass" : "fail";

        const row = `
            <tr>
                <td>${student.name}</td>
                <td>${student.scores[0]}</td>
                <td>${student.scores[1]}</td>
                <td>${student.scores[2]}</td>
                <td>${avg}</td>
                <td class="${remarkClass}">${remark}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    }
}

function searchStudent() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filteredResults = [];

    for (let i = 0; i < students.length; i++) {
        if (students[i].name.toLowerCase().includes(query)) {
            filteredResults.push(students[i]);
        }
    }
    renderTable(filteredResults);
}

function filterByStatus(type) {
    let results = [];

    if (type === 'Present') {
        results = students.filter(s => s.present === true);
    } else if (type === 'Absent') {
        results = students.filter(s => s.present === false);
    } else if (type === 'Passed') {
        students.forEach(s => {
            if (calculateAverage(s.scores) >= 75) results.push(s);
        });
    } else if (type === 'Failed') {
        students.forEach(s => {
            if (calculateAverage(s.scores) < 75) results.push(s);
        });
    }

    renderTable(results);
}

// Load initial data
renderTable(students);