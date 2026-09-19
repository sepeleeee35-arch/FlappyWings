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
let gameRunning = false;
let score = 0;
let pipes = [];
let pipeTimer = 0;

const gravity = 0.45;
const jumpPower = -7;
const pipeSpeed = 3;
const pipeGap = 170;
const pipeWidth = 65;

function resetGame() {
    birdY = 45;
    velocity = 0;
    score = 0;
    pipeTimer = 0;

    scoreText.textContent = "0";
    bird.style.top = birdY + "%";

    pipes.forEach(function(pipe) {
        pipe.top.remove();
        pipe.bottom.remove();
    });

    pipes = [];
}

function startGame(event) {
    if (event) {
        event.stopPropagation();
    }

    resetGame();

    gameRunning = true;

    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";

    requestAnimationFrame(gameLoop);
}

function jump(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (gameRunning) {
        velocity = jumpPower;
    }
}

function createPipe() {
    const gameHeight = game.clientHeight;

    const minTop = 80;
    const maxTop = gameHeight - pipeGap - 80;

    const topHeight =
        Math.random() * (maxTop - minTop) + minTop;

    const bottomHeight =
        gameHeight - topHeight - pipeGap;

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

function collision(pipe) {
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

    velocity += gravity;
    birdY += velocity * 0.12;

    bird.style.top = birdY + "%";

    if (birdY <= 0) {
        birdY = 0;
        velocity = 0;
    }

    if (birdY >= 90) {
        gameOver();
        return;
    }

    pipeTimer++;

    if (pipeTimer >= 100) {
        createPipe();
        pipeTimer = 0;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];

        pipe.x -= pipeSpeed;

        pipe.top.style.left = pipe.x + "px";
        pipe.bottom.style.left = pipe.x + "px";

        if (
            !pipe.passed &&
            pipe.x + pipeWidth < game.clientWidth * 0.25
        ) {
            pipe.passed = true;
            score++;
            scoreText.textContent = score;
        }

        if (collision(pipe)) {
            gameOver();
            return;
        }

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

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

game.addEventListener("touchstart", jump, { passive: false });
game.addEventListener("mousedown", jump);