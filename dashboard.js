
// DASHBOARD 
let phase = 1;
let energy = 100;
let currentTaskIndex = null;
let countDown = 300;

const score = {
    innovation: 0,
    technical: 0,
    design: 0,
    collab: 0,
    pitch: 0
};

const taskList = [
    {name: "Design Homepage UI", category: "UI", points: 3, completed: false},
    {name: "Set Up Backend API", category: "Logic", points: 4, completed: false},
    {name: "Write Project Proposal", category: "Innovation", points: 5, completed: false},
    {name: "Fix Login Bug", category: "Debug", points: 3, completed: false},
    {name: "Rehearse Pitch", category: "Pitch", points: 4, completed: false}
];

function renderTasks() {
    const container = document.getElementById("taskContainer");
    container.innerHTML = '';
    taskList.forEach((task, index) => {
        const col = document.createElement("div");
        col.className = "col-md-6";
        col.innerHTML = `
        <div class="card task-card mb-3 ${task.completed ? 'bg-success text-white' : ''}">
            <div class="card-body">
                <h6 class="card-title">${task.name}</h6>
                <p class="card-text">Category: ${task.category} | Points: ${task.points}</p>
                ${task.completed
                    ? '<button class="btn btn-sm" disabled>Completed</button>'
                    : `<button class="btn btn-sm btn-danger" onclick="startTask(${index})">Start Task</button>`
                }
                
            </div>
        </div>
        `;
        container.appendChild(col);
    });
}

function completeTask(index) {
    const task = taskList[index];
    if (energy < 10) return alert("Not enough energy.");
    energy -= 3;
    document.getElementById("energyBar").style.width = energy + "%";
    updateScore(task);
    taskList.splice(index, 1);
    renderTasks();
}

function updateScore(task) {
    if(task.category === "UI") score.design += task.points;
    if(task.category === "Logic" || task.category === "Debug") score.technical += task.points;
    if(task.category === "Innovation") score.innovation += task.points;
    if(task.category === "Pitch") score.pitch += task.points;

    document.getElementById("scoreInnovation").innerText = score.innovation;
    document.getElementById("scoreTechnical").innerText = score.technical;
    document.getElementById("scoreDesign").innerText = score.design;
    document.getElementById("scoreCollab").innerText = score.collab;
    document.getElementById("scorePitch").innerText = score.pitch;
}

function updateEnergyBar() {
    document.getElementById("energyBar").style.width = energy + "%";
    document.getElementById("energyBar").innerText = energy + "%";
}

function nextPhase() {
    const incomplete = taskList.filter(task => !task.completed);
    if (incomplete.length > 0) {
        alert("Complete all tasks before moving to the next phase.");
        return;
    }

    if (phase >= 5){
        localStorage.setItem("finalScore", JSON.stringify(score));
        window.location.href = "result.html";
        return;
    }

    phase += 1;
    energy = 100;
    countDown = 300;
    document.getElementById("phaseDisplay").innerText = phase;
    updateEnergyBar();

    taskList.forEach(task => task.completed = false);

    renderTasks();
    randomEvent();
}

function randomEvent() {
    const events = [
        "Team conflict: Lose 10 energy.",
        "Backend crash: Logic task removed.",
        "Mentorship bonus: Gain 5 pitch points!",
        "Team synergy boost: +5 collaboartion!"
    ];
    const evt = events[Math.floor(Math.random() * events.length)];
    document.getElementById("eventBox").innerText = evt;

    if (evt.includes("Lose")) energy -= 10;
    if (evt.includes("removed")) {
        const i = taskList.findIndex(t => t.category === "Logic");
        if (i !== -1) taskList.splice(i, 1);
    } 
    if (evt.includes("Gain")) score.pitch += 5;
    if (evt.includes("synergy")) score.collab += 5;

    updateEnergyBar();

    document.getElementById("scorePitch").innerText = score.pitch;
    document.getElementById("scoreCollab").innerText = score.collab;
}

document.getElementById('submitModal').addEventListener('hidden.bs.modal', function() {
    document.getElementById('submitForm').reset();
    currentTaskIndex = null;
});


function startTask(index) {
    currentTaskIndex = index;
    const modal = new bootstrap.Modal(document.getElementById('submitModal'));
    modal.show();
}

document.getElementById('submitForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const link = document.getElementById('githubLink').value;

    if(!link.startsWith('https://github.com/')){
        alert('Please a valid Github repository URL.');
        return;
    }

    const task = taskList[currentTaskIndex];
    if (!task) {
        alert("Task not found. Please try again.");
        return;
    }
    if (energy < 10) {
        alert("Not enough energy to complete this task.");
        return;
    }

    energy -= 10;
    task.completed = true;
    updateScore(task);

    let categoryLabel = {
        UI: "UI/UX",
        Logic: "Technical",
        Debug: "Technical",
        Innovation: "Innovation",
        Pitch: "Pitch"
    }[task.category] || "Points";

    const toastEl = document.getElementById("taskToast");
    document.getElementById("toastMessage").innerText = `You gained ${categoryLabel} points!`;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    renderTasks();
    updateEnergyBar();

    document.getElementById('submitForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('submitModal')).hide();

});



function startTimer() {
    const timerDisplay = document.getElementById("timer");
    const interval = setInterval(() => {
        const minutes = Math.floor(countDown / 60);
        const seconds = countDown % 60;
        timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        countDown--;

        if (countDown < 0) {
            clearInterval(interval);
            alert("Time's up for this phase! Complete tasks faster next time.");
            nextPhase();
        }
    }, 1000);
}

renderTasks();
randomEvent();
startTimer();