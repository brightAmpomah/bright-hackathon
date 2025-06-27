const score = JSON.parse(localStorage.getItem("finalScore")) || {
    innovation: 0,
    technical: 0,
    design: 0,
    collab: 0,
    pitch: 0
};

document.getElementById("scoreInnovation").innerText = score.innovation;
document.getElementById("scoreTechnical").innerText = score.technical;
document.getElementById("scoreDesign").innerText = score.design;
document.getElementById("scoreCollab").innerText = score.collab;
document.getElementById("scorePitch").innerText = score.pitch;

const totalScore = Object.values(score).reduce((a, b) => a + b, 0);
const awardImg = document.getElementById("awardImage");
const awardText = document.getElementById("awardText");

if (totalScore >= 40) {
    awardImg.src = "https://cdn-icons-png.flaticon.com/512/2583/2583313.png";
    awardText.innerText = "Hackathon Hero - Excellent Execution!";
}else if(totalScore >= 30) {
    awardImg.src = "https://cdn-icons-png.flaticon.com/512/4208/4208361.png";
    awardText.innerText = "Skilled Innovator - Strong Contribution";
}else if (totalScore >= 20) {
    awardImg.src = "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";
    awardText.innerText = "Emerging Coder - Good Start, Keep Growing";
}else{
    awardImg.src = "https://cdn-icons-png.flaticon.com/512/564/564619.png";
    awardText.innerText = "Participation Badge - Try Again";
}