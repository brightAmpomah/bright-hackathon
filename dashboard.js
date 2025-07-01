
// DASHBOARD 
let phase = 1;
let energy = 100;
let currentTaskIndex = null;
let countDown = 300;
let usedTasks = [];
let taskList = [];
let usedRepos = new Set();

const music = document.getElementById("bgMusic");

music.volume = 0.2;
music.play().catch(() => {
    console.log("Music play was blocked until user interaction");
});

const score = {
    innovation: 0,
    technical: 0,
    design: 0,
    collab: 0,
    pitch: 0
};

const taskBank = [
    { name: "Design Landing Page", category: "UI", points: 3 },
    { name: "Integrate Payment API", category: "Logic", points: 4 },
    { name: "Write Problem Statement", category: "Innovation", points: 4 },
    { name: "Fix Login Timeout Bug", category: "Debug", points: 3 },
    { name: "Record Elevator Pitch", category: "Pitch", points: 4 },
    { name: "Build Profile Page", category: "UI", points: 3 },
    { name: "Create ER Diagram", category: "Logic", points: 3 },
    { name: "Validate User Form", category: "Debug", points: 2 },
    { name: "Design App Icon", category: "UI", points: 2 },
    { name: "Mock-up Feedback Flow", category: "UI", points: 2 },
    { name: "Setup Node Server", category: "Logic", points: 4 },
    { name: "Refactor Auth Logic", category: "Debug", points: 4 },
    { name: "Pitch to Judges", category: "Pitch", points: 5 },
    { name: "Research Competitors", category: "Innovation", points: 3 },
    { name: "Design Pitch Slides", category: "UI", points: 3 },
    { name: "Build Signup Logic", category: "Logic", points: 3 },
    { name: "Check Console Errors", category: "Debug", points: 2 },
    { name: "Prepare User Journey", category: "Innovation", points: 4 },
    { name: "Optimize CSS", category: "Debug", points: 2 },
    { name: "Build FAQ Page", category: "UI", points: 2 },
    { name: "Test Input Validations", category: "Debug", points: 2 },
    { name: "Team Sync Session", category: "Pitch", points: 2 },
    { name: "Link App to DB", category: "Logic", points: 4 },
    { name: "Document APIs", category: "Logic", points: 3 },
    { name: "Analyze Survey Results", category: "Innovation", points: 3 },
    { name: "UI Theme Switcher", category: "UI", points: 3 },
    { name: "Debug OAuth Flow", category: "Debug", points: 4 },
    { name: "Test Responsiveness", category: "UI", points: 2 },
    { name: "Add Google Login", category: "Logic", points: 3 },
    { name: "Craft Brand Tagline", category: "Innovation", points: 2 },
    { name: "Create Loading Screen", category: "UI", points: 2 },
    { name: "Fix 404 Page Error", category: "Debug", points: 2 },
    { name: "Update README.md", category: "Pitch", points: 2 },
    { name: "Implement Dark Mode", category: "UI", points: 3 },
    { name: "Simulate Payment Failure", category: "Logic", points: 3 },
    { name: "Pitch Demo Setup", category: "Pitch", points: 3 },
    { name: "Draw Wireframes", category: "UI", points: 3 },
    { name: "Migrate Old Code", category: "Logic", points: 4 },
    { name: "Brainstorm Campaign", category: "Innovation", points: 4 },
    { name: "Team Logo Design", category: "UI", points: 2 },
    { name: "Security Patch Fix", category: "Debug", points: 3 },
    { name: "Improve Onboarding", category: "UI", points: 3 },
    { name: "Conduct Peer Review", category: "Pitch", points: 3 },
    { name: "Enhance User Flow", category: "Innovation", points: 3 },
    { name: "Bug Hunt Challenge", category: "Debug", points: 4 },
    { name: "Optimize Queries", category: "Logic", points: 4 },
    { name: "Polish Team Intro", category: "Pitch", points: 3 },
    { name: "Build Feedback Widget", category: "Logic", points: 3 },
    { name: "Craft Mission Statement", category: "Innovation", points: 2 }
];

function drawPhaseTasks() {
    const availableTasks = taskBank.filter(t => !usedTasks.includes(t.name));
    const shuffled = availableTasks.sort(() => 0.5 - Math.random());
    taskList = shuffled.slice(0, 3).map(t => ({...t, completed: false, repo: "", resubmitted: false}));
    usedTasks.push(...taskList.map(t => t.name));
}

function renderTasks() {
    const container = document.getElementById("taskContainer");
    container.innerHTML = '';
    taskList.forEach((task, index) => {
        const btnStart = `<button class="btn btn-sm btn-danger me-2" onclick="openSubmitModal(${index})">Start</button>`;
        const btnResubmit = task.completed && !task.resubmitted
        ? `<button class="btn btn-sm ms-auto btn-warning" onclick="openResubmitModal(${index})">Re-submit</button>`
        : "";

        const btnStatus = task.completed
        ? `<span class="badge bg-primary me-2">Completed</span>`
        : btnStart;

        const col = document.createElement("div");
        col.className = "col-md-6";
        col.innerHTML = `
        <div class="card task-card mb-3">
            <div class="card-body">
                <h6 class="card-title">${task.name}</h6>
                <p class="card-text">Category: ${task.category} | Points: ${task.points}</p> 
                <div>${btnStatus} ${btnResubmit}</div>
            </div>
        </div>
        `;
        container.appendChild(col);
    });
}

function completeTask(index) {
    const task = taskList[index];
    if (energy < 10) return alert("Not enough energy.");
    energy -= 10;
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
        music.pause();
        music.currentTime = 0;
        localStorage.setItem("finalScore", JSON.stringify(score));
        window.location.href = "result.html";
        return;
    }

    phase += 1;
    energy = 100;
    countDown = 300;
    startTimer();

    document.getElementById("phaseDisplay").innerText = phase;
    updateEnergyBar();

    drawPhaseTasks();

    renderTasks();
    randomEvent();
}

function randomEvent() {
    const events = [
        "Team conflict: Lose 30 energy.",
        "Backend crash: Logic task removed.",
        "Mentorship bonus: Gain 3 pitch points!",
        "Team synergy boost: +3 collaboartion!"
    ];
    const evt = events[Math.floor(Math.random() * events.length)];
    document.getElementById("eventBox").innerText = evt;

    if (evt.includes("Lose")) energy -= 30;
    if (evt.includes("removed")) {
        const i = taskList.findIndex(t => t.category === "Logic");
        if (i !== -1) taskList.splice(i, 1);
    } 
    if (evt.includes("Gain")) score.pitch += 3;
    if (evt.includes("synergy")) score.collab += 3;

    updateEnergyBar();

    document.getElementById("scorePitch").innerText = score.pitch;
    document.getElementById("scoreCollab").innerText = score.collab;
}

document.getElementById('submitModal').addEventListener('hidden.bs.modal', function() {
    document.getElementById('submitForm').reset();
    currentTaskIndex = null;
});

function openResubmitModal(taskIndex){
    currentTaskIndex = taskIndex;
    document.getElementById('submitModalLabel').innerText = "Re-submit GitHub Repository";
    document.getElementById('submitForm').dataset.resubmit = "true";
    document.getElementById('githubLink').value = "";
    new bootstrap.Modal(document.getElementById('submitModal')).show();
}

function openSubmitModal(taskIndex) {
    currentTaskIndex = taskIndex;
    document.getElementById('submitModalLabel').innerText = "Submit GitHub Repository";
    document.getElementById('submitForm').dataset.resubmit = "false";
    document.getElementById('githubLink').value = "";
    new bootstrap.Modal(document.getElementById('submitModal')).show();
}

function startTask(index) {
    currentTaskIndex = index;
    const modal = new bootstrap.Modal(document.getElementById('submitModal'));
    modal.show();
}

document.getElementById('submitForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const link = document.getElementById('githubLink').value.trim();
    const task = taskList[currentTaskIndex];
    const isResub = this.dataset.resubmit === "true";

    if(!link.startsWith('https://github.com/')){
        alert('Please a valid Github repository URL.');
        return;
    }

    if (usedRepos.has(link)) {
        alert('This Github repository has already been used.\nChoose a diffrent one.');
        return;
    }

    if (isResub){
        if (task.resubmitted) {
            alert('You already used your re-submit chance for this task.');
            return;
        }
        if (link === task.repo){
        alert('Cannot re-submit the same repository. Use a diffrent one');
        return;
        }

        task.repo = link;
        task.resubmitted = true;
        usedRepos.add(link);
        alert("Repository successfully re-submitted");
    }else {
        if (task.completed) {
            alert("Task already completed");
            return;
        }
        if (energy < 10) {
        alert("Not enough energy to complete this task.");
        return;
        }
        task.completed = true;
        task.repo = link;
        usedRepos.add(link);
        energy -= 10;
        updateScore(task);

    }
    
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

    updateEnergyBar();
    renderTasks();
    this.reset();
    bootstrap.Modal.getInstance(document.getElementById('submitModal')).hide();

});

function speakCountdown(number) {
    const utterance = new SpeechSynthesisUtterance(`${number}`);
    utterance.rate = 1;
    utterance.volume = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
}

let voiceStarted = false;
    
function startTimer() {
    
    const timerDisplay = document.getElementById("timer");
    const interval = setInterval(() => {
        const minutes = Math.floor(countDown / 60);
        const seconds = countDown % 60;
        timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (countDown <= 10 && countDown > 0) {
            speakCountdown(countDown);
        }

        countDown--;

        if (countDown < 0) {
            clearInterval(interval);
            music.pause();
            music.currentTime = 0;
            alert("Time's up for this phase! Complete tasks faster next time.\n Submitting your final score");

            localStorage.setItem("finalScore", JSON.stringify(score));
            speechSynthesis.cancel();
            window.location.href = "result.html";
        }
    }, 1000);
}

drawPhaseTasks();
renderTasks();
randomEvent();
startTimer();