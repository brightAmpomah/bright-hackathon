//SETUP
const roles = [
    "Frontend Developer", 
    "Backend Developer", 
    "UI/UX Designer", 
    "Data Analyst", 
    "Project Manager", 
    "Pitch Presenter"
];

let selectedRoles = {};

function generateTeamInputs() {
    const teamSize = document.getElementById("teamSize").value;
    const formArea = document.getElementById("teamFormArea");
    formArea.innerHTML = '';
    selectedRoles = {};

    for (let i = 1; i <= teamSize; i++) {
        const div = document.createElement("div");
        div.classList.add("mb-4");

        div.innerHTML = `
        <label class="form-label">Player ${i} Role:</label>
        <div class="d-flex flex-wrap gap-2" id="roleOptions${i}"></div>
        `;
        formArea.appendChild(div)

        const roleBox = document.getElementById(`roleOptions${i}`);
        roles.forEach(role => {
            const card = document.createElement("div");
            card.className = "role-card";
            card.innerText = role;
            card.onclick = () => selectRole(i, role, card);
            roleBox.appendChild(card);
        });
    }
}

function selectRole(playerNumber, role, element) {
    const roleAlreadyTaken = Object.values(selectedRoles).includes(role);
    if (roleAlreadyTaken && selectedRoles[playerNumber] !== role) {
        alert(`The role "${role}" is already taken by another player.`);
        return;
    }

    const container = document.getElementById(`roleOptions${playerNumber}`);
    Array.from(container.children).forEach(card => card.classList.remove('selected'));

    element.classList.add('selected');
    selectedRoles[playerNumber] = role;
}

function validateSelection() {
    const teamSize = document.getElementById("teamSize").value;
    if(!teamSize){
        alert("Please select a team size.");
        return;
    }

    const selected = Object.values(selectedRoles);
    if(selected.length < teamSize) {
        alert("Each player must select a role before continuing.");
        return;
    }

    const hasDuplicates = selected.some((val, i, arr) => arr.indexOf(val) !== i);
    if(hasDuplicates) {
        alert("Each role must be unique. Please resolve duplicate selections.");
        return;
    }

    window.location.href = "dashboard.html";
}