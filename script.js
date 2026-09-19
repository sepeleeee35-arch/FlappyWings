const button = document.getElementById("startButton");
const menu = document.getElementById("menu");
const bird = document.getElementById("bird");
const score = document.getElementById("score");

let running = false;
let birdY = 45;
let velocity = 0;
let points = 0;

button.onclick = function () {

    console.log("MULAI BERHASIL");

    running = true;

    menu.style.display = "none";

    points = 0;
    score.textContent = "0";

    birdY = 45;
    velocity = 0;

    gameLoop();
};


function gameLoop() {

    if (!running) {
        return;
    }

    velocity += 0.4;

    birdY += velocity * 0.1;

    bird.style.top = birdY + "%";

    requestAnimationFrame(gameLoop);
}


document.getElementById("game").addEventListener("pointerdown", function(event) {

    if (!running) {
        return;
    }

    if (event.target === button) {
        return;
    }

    velocity = -7;
});