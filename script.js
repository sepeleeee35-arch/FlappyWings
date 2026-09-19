const game = document.getElementById("game");
const bird = document.getElementById("bird");
const scoreText = document.getElementById("score");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const finalScore = document.getElementById("finalScore");

let birdY = 45;
let velocity = 0;

const gravity = 0.45;
const jumpPower = -7;

let gameRunning = false;
let score = 0;
let pipes = [];
let pipeTimer = 0;

const pipeWidth = 65;
const pipeGap = 170;
const pipeSpeed = 3;


// =========================
// RESET GAME
// =========================

function resetGame() {
    birdY = 45;
    velocity = 0;
    score = 0;
    pipeTimer = 0;

    scoreText.textContent = "0";

    pipes.forEach(pipe => {
        if (pipe.topElement) pipe.topElement.remove();
        if (pipe.bottomElement) pipe.bottomElement.remove();
    });

    pipes = [];

    bird.style.top = birdY + "%";
}


// =========================
// START GAME
// =========================

function startGame(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    resetGame();

    gameRunning = true;

    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";

    bird.style.display = "block";

    gameLoop();
}


// =========================
// JUMP
// =========================

function jump(event) {
    if (event) {
        event.preventDefault();
    }

    if (!gameRunning) return;

    velocity = jumpPower;
}


// =========================
// CREATE PIPE
// =========================

function createPipe() {
    const gameHeight = game.clientHeight;

    const minTop = 80;
    const maxTop = gameHeight - pipeGap - 100;

    const topHeight =
        Math.floor(Math.random() * (maxTop - minTop)) + minTop;

    const bottomHeight =
        gameHeight - topHeight - pipeGap;

    const topPipe = document.createElement("div");
    const bottomPipe = document.createElement("div");

    topPipe.className = "pipe";
    bottomPipe.className = "pipe";

    topPipe.style.position = "absolute";
    topPipe.style.width = pipeWidth + "px";
    topPipe.style.height = topHeight + "px";
    topPipe.style.top = "0";
    topPipe.style.left = game.clientWidth + "px";

    bottomPipe.style.position = "absolute";
    bottomPipe.style.width = pipeWidth + "px";
    bottomPipe.style.height = bottomHeight + "px";
    bottomPipe.style.bottom = "0";
    bottomPipe.style.left = game.clientWidth + "px";

    game.appendChild(topPipe);
    game.appendChild(bottomPipe);

    pipes.push({
        x: game.clientWidth,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        passed: false,
        topElement: topPipe,
        bottomElement: bottomPipe
    });
}


// =========================
// COLLISION
// =========================

function checkCollision(pipe) {
    const birdRect = bird.getBoundingClientRect();
    const topRect = pipe.topElement.getBoundingClientRect();
    const bottomRect = pipe.bottomElement.getBoundingClientRect();

    const hitTop =
        birdRect.right > topRect.left &&
        birdRect.left < topRect.right &&
        birdRect.top < topRect.bottom;

    const hitBottom =
        birdRect.right > bottomRect.left &&
        birdRect.left < bottomRect.right &&
        birdRect.bottom > bottomRect.top;

    return hitTop || hitBottom;
}


// =========================
// GAME OVER
// =========================

function gameOver() {
    gameRunning = false;

    finalScore.textContent = score;

    gameOverScreen.style.display = "flex";
}


// =========================
// UPDATE GAME
// =========================

function update() {
    if (!gameRunning) return;

    velocity += gravity;
    birdY += velocity * 0.1;

    bird.style.top = birdY + "%";

    pipeTimer++;

    if (pipeTimer > 100) {
        createPipe();
        pipeTimer = 0;
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        pipe.topElement.style.left = pipe.x + "px";
        pipe.bottomElement.style.left = pipe.x + "px";

        if (!pipe.passed && pipe.x + pipeWidth < bird.offsetLeft) {
            pipe.passed = true;
            score++;

            scoreText.textContent = score;
        }

        if (checkCollision(pipe)) {
            gameOver();
        }
    });

    pipes = pipes.filter(pipe => {
        if (pipe.x < -pipeWidth) {
            pipe.topElement.remove();
            pipe.bottomElement.remove();
            return false;
        }

        return true;
    });

    if (birdY < 0 || birdY > 90) {
        gameOver();
    }
}


// =========================
// GAME LOOP
// =========================

function gameLoop() {
    if (!gameRunning) return;

    update();

    requestAnimationFrame(gameLoop);
}


// =========================
// BUTTONS
// =========================

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);


// =========================
// TOUCH / MOUSE
// =========================

game.addEventListener("pointerdown", function(event) {

    // Jangan jalankan jump kalau yang ditekan adalah tombol
    if (
        event.target === startButton ||
        event.target === restartButton ||
        event.target.closest("button")
    ) {
        return;
    }

    if (gameRunning) {
        jump(event);
    }
});


// Keyboard
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        jump(event);
    }
});