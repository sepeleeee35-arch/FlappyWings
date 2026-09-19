const game = document.getElementById("game");
const bird = document.getElementById("bird");

const scoreText = document.getElementById("score");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const finalScore = document.getElementById("finalScore");


// ============================
// PENGATURAN GAME
// ============================

const gravity = 0.35;

const lift = -0.65;

const maxFallSpeed = 8;

const pipeSpeed = 2.4;

const pipeGap = 230;

const pipeWidth = 70;

const pipeInterval = 1150;


// ============================
// VARIABEL
// ============================

let birdY = 45;

let velocity = 0;

let score = 0;

let gameRunning = false;

let holding = false;

let pipes = [];

let lastPipeTime = 0;

let animationId;


// ============================
// RESET
// ============================

function resetGame() {

    birdY = 45;

    velocity = 0;

    score = 0;

    holding = false;

    lastPipeTime = performance.now();

    scoreText.textContent = "0";

    bird.style.top = birdY + "%";

    bird.style.transform = "rotate(0deg)";


    pipes.forEach(pipe => {

        pipe.top.remove();
        pipe.bottom.remove();

    });

    pipes = [];
}


// ============================
// START
// ============================

function startGame() {

    resetGame();

    gameRunning = true;

    startScreen.style.display = "none";

    gameOverScreen.style.display = "none";

    cancelAnimationFrame(animationId);

    animationId = requestAnimationFrame(gameLoop);
}


// ============================
// GAME OVER
// ============================

function gameOver() {

    if (!gameRunning) return;

    gameRunning = false;

    holding = false;

    finalScore.textContent = score;

    gameOverScreen.style.display = "flex";
}


// ============================
// BUAT PIPA
// ============================

function createPipe() {

    const gameHeight = game.clientHeight;

    const groundHeight = 70;

    const minTop = 80;

    const maxTop =
        gameHeight -
        groundHeight -
        pipeGap -
        80;

    const topHeight =
        Math.random() *
        (maxTop - minTop) +
        minTop;

    const bottomHeight =
        gameHeight -
        groundHeight -
        topHeight -
        pipeGap;


    const topPipe = document.createElement("div");

    const bottomPipe = document.createElement("div");


    topPipe.className = "pipe top";

    bottomPipe.className = "pipe bottom";


    topPipe.style.height =
        topHeight + "px";

    bottomPipe.style.height =
        bottomHeight + "px";


    topPipe.style.top = "0";

    bottomPipe.style.bottom =
        groundHeight + "px";


    const startX =
        game.clientWidth + 20;

    topPipe.style.left =
        startX + "px";

    bottomPipe.style.left =
        startX + "px";


    game.appendChild(topPipe);

    game.appendChild(bottomPipe);


    pipes.push({

        x: startX,

        top: topPipe,

        bottom: bottomPipe,

        passed: false

    });
}


// ============================
// CEK TABRAKAN
// ============================

function collision(pipe) {

    const birdRect =
        bird.getBoundingClientRect();

    const topRect =
        pipe.top.getBoundingClientRect();

    const bottomRect =
        pipe.bottom.getBoundingClientRect();


    // Sedikit perkecil area collision
    // supaya terasa lebih adil.

    const padding = 7;


    const birdLeft =
        birdRect.left + padding;

    const birdRight =
        birdRect.right - padding;

    const birdTop =
        birdRect.top + padding;

    const birdBottom =
        birdRect.bottom - padding;


    const hitTop =

        birdRight > topRect.left &&

        birdLeft < topRect.right &&

        birdTop < topRect.bottom;


    const hitBottom =

        birdRight > bottomRect.left &&

        birdLeft < bottomRect.right &&

        birdBottom > bottomRect.top;


    return hitTop || hitBottom;
}


// ============================
// UPDATE
// ============================

function update(time) {

    if (!gameRunning) return;


    // ========================
    // BURUNG
    // ========================

    if (holding) {

        // TAHAN = TERBANG NAIK

        velocity += lift;

    } else {

        // LEPAS = JATUH

        velocity += gravity;

    }


    // Batasi kecepatan

    if (velocity < -7) {
        velocity = -7;
    }

    if (velocity > maxFallSpeed) {
        velocity = maxFallSpeed;
    }


    birdY += velocity * 0.12;


    bird.style.top =
        birdY + "%";


    // Rotasi burung mengikuti gerakan

    let rotation =
        velocity * 4;

    rotation =
        Math.max(-25, Math.min(70, rotation));

    bird.style.transform =
        "rotate(" + rotation + "deg)";


    // ========================
    // PIPA
    // ========================

    if (
        time - lastPipeTime >
        pipeInterval
    ) {

        createPipe();

        lastPipeTime = time;
    }


    pipes.forEach(pipe => {

        pipe.x -= pipeSpeed;


        pipe.top.style.left =
            pipe.x + "px";

        pipe.bottom.style.left =
            pipe.x + "px";


        // SCORE

        if (
            !pipe.passed &&
            pipe.x + pipeWidth <
            bird.offsetLeft
        ) {

            pipe.passed = true;

            score++;

            scoreText.textContent =
                score;
        }


        // COLLISION

        if (collision(pipe)) {

            gameOver();
        }

    });


    // Hapus pipa yang sudah lewat

    pipes = pipes.filter(pipe => {

        if (
            pipe.x <
            -pipeWidth - 20
        ) {

            pipe.top.remove();

            pipe.bottom.remove();

            return false;
        }

        return true;
    });


    // ========================
    // TANAH / LANGIT
    // ========================

    const gameHeight =
        game.clientHeight;

    const birdRect =
        bird.getBoundingClientRect();

    const gameRect =
        game.getBoundingClientRect();


    const birdBottom =
        birdRect.bottom -
        gameRect.top;


    const birdTop =
        birdRect.top -
        gameRect.top;


    // Jatuh ke tanah

    if (
        birdBottom >=
        gameHeight - 70
    ) {

        gameOver();
    }


    // Terbang terlalu tinggi

    if (birdTop <= 0) {

        gameOver();
    }
}


// ============================
// GAME LOOP
// ============================

function gameLoop(time) {

    if (!gameRunning) return;

    update(time);

    animationId =
        requestAnimationFrame(gameLoop);
}


// ============================
// KONTROL SENTUH
// ============================

game.addEventListener(
    "pointerdown",
    function(event) {

        if (
            event.target.closest("button")
        ) {
            return;
        }

        if (!gameRunning) {
            return;
        }

        holding = true;
    }
);


game.addEventListener(
    "pointerup",
    function() {

        holding = false;
    }
);


game.addEventListener(
    "pointercancel",
    function() {

        holding = false;
    }
);


game.addEventListener(
    "pointerleave",
    function() {

        holding = false;
    }
);


// ============================
// TOMBOL
// ============================

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


// ============================
// KEYBOARD
// ============================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space"
        ) {

            holding = true;
        }
    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (
            event.code === "Space"
        ) {

            holding = false;
        }
    }
);