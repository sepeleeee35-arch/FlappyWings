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
let gravity = 0.45;
let jumpPower = -7;

let gameRunning = false;
let score = 0;

let pipes = [];
let pipeTimer = 0;

const pipeWidth = 65;
const pipeGap = 170;
const pipeSpeed = 3;

function resetGame() {
    birdY = 45;
    velocity = 0;
    score = 0;
    pipeTimer = 0;

    scoreText.textContent = score;

    pipes.forEach(pipe => {
        pipe.top.remove();
        pipe.bottom.remove();
    });

    pipes = [];

    bird.style.top = birdY + "%";
}

function startGame() {
    resetGame();

    gameRunning = true;

    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";

    gameLoop();
}

function jump() {
    if (!gameRunning) return;

    velocity = jumpPower;
}

function createPipe() {
    const gameHeight = game.clientHeight;

    const minHeight = 80;
    const maxTopHeight = gameHeight - pipeGap - 80;

    const topHeight =
        Math.random() * (maxTopHeight - minHeight) + minHeight;

    const bottomHeight = gameHeight - topHeight - pipeGap;

    const topPipe = document.createElement("div");
    topPipe.className = "pipe top";

    const bottomPipe = document.createElement("div");
    bottomPipe.className = "pipe bottom";

    topPipe.style.height = topHeight + "px";
    bottomPipe.style.height = bottomHeight + "px";

    topPipe.style.left = game.clientWidth + "px";
    bottomPipe.style.left = game.clientWidth + "px";

    game.appendChild(topPipe);
    game.appendChild(bottomPipe);

    pipes.push({
        top: topPipe,
        bottom: bottomPipe,
        x: game.clientWidth,
        passed: false
    });
}

function checkCollision(pipe) {
    const birdRect = bird.getBoundingClientRect();
    const topRect = pipe.top.getBoundingClientRect();
    const bottomRect = pipe.bottom.getBoundingClientRect();

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

function gameOver() {
    gameRunning = false;

    finalScore.textContent = score;
    gameOverScreen.style.display = "flex";
}

function update() {
    if (!gameRunning) return;

    // Gerakan burung
    velocity += gravity;
    birdY += velocity * 0.12;

    bird.style.top = birdY + "%";

    // Batas atas
    if (birdY <= 0) {
        birdY = 0;
        velocity = 0;
    }

    // Batas bawah
    if (birdY >= 90) {
        gameOver();
        return;
    }

    // Buat pipa
    pipeTimer++;

    if (pipeTimer > 100) {
        createPipe();
        pipeTimer = 0;
    }

    // Gerakkan pipa
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];

        pipe.x -= pipeSpeed;

        pipe.top.style.left = pipe.x + "px";
        pipe.bottom.style.left = pipe.x + "px";

        // Tambah skor
        if (!pipe.passed && pipe.x + pipeWidth < game.clientWidth * 0.25) {
            pipe.passed = true;
            score++;
            scoreText.textContent = score;
        }

        // Cek tabrakan
        if (checkCollision(pipe)) {
            gameOver();
            return;
        }

        // Hapus pipa yang sudah keluar
        if (pipe.x < -pipeWidth) {
            pipe.top.remove();
            pipe.bottom.remove();
            pipes.splice(i, 1);
        }
    }
}

function gameLoop() {
    if (!gameRunning) return;

    update();

    requestAnimationFrame(gameLoop);
}

// Tombol mulai
startButton.addEventListener("click", startGame);

// Tombol main lagi
restartButton.addEventListener("click", startGame);

// Sentuh layar untuk terbang
game.addEventListener("touchstart", function(event) {
    event.preventDefault();

    if (gameRunning) {
        jump();
    }
});

// Klik mouse juga bisa digunakan
game.addEventListener("mousedown", function() {
    if (gameRunning) {
        jump();
    }
});