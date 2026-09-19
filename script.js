const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const game = document.getElementById("game");

const scoreText = document.getElementById("score");

const startScreen =
    document.getElementById("startScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const finalScore =
    document.getElementById("finalScore");


// ==================================================
// UKURAN GAME
// ==================================================

let W = 0;
let H = 0;


// ==================================================
// BURUNG
// ==================================================

const bird = {

    x: 0,

    y: 0,

    radius: 18,

    velocity: 0

};


// ==================================================
// FISIKA
// ==================================================

const gravity = 0.38;

const flyPower = -0.65;

const maxUpSpeed = -7;

const maxDownSpeed = 8;


// ==================================================
// PIPA
// ==================================================

let pipes = [];

const pipeWidth = 70;

const pipeGap = 220;

const pipeSpeed = 2.5;

let pipeTimer = 0;

const pipeDelay = 90;


// ==================================================
// GAME
// ==================================================

let running = false;

let holding = false;

let score = 0;

let animationId = 0;


// ==================================================
// RESIZE CANVAS
// ==================================================

function resizeGame() {

    const rect =
        game.getBoundingClientRect();

    W = rect.width;
    H = rect.height;

    canvas.width = W;
    canvas.height = H;

    if (!running) {

        bird.x = W * 0.25;

        bird.y = H * 0.45;

    }
}


// ==================================================
// RESET
// ==================================================

function resetGame() {

    resizeGame();

    bird.x = W * 0.25;

    bird.y = H * 0.45;

    bird.velocity = 0;

    pipes = [];

    pipeTimer = 0;

    score = 0;

    scoreText.textContent = "0";

    finalScore.textContent = "0";

    holding = false;
}


// ==================================================
// START
// ==================================================

function startGame() {

    cancelAnimationFrame(animationId);

    resetGame();

    running = true;

    startScreen.style.display = "none";

    gameOverScreen.style.display = "none";

    animationId =
        requestAnimationFrame(gameLoop);
}


// ==================================================
// GAME OVER
// ==================================================

function gameOver() {

    if (!running) {
        return;
    }

    running = false;

    holding = false;

    finalScore.textContent =
        score;

    gameOverScreen.style.display =
        "flex";
}


// ==================================================
// BUAT PIPA
// ==================================================

function createPipe() {

    const groundHeight = 70;

    const minGapY = 120;

    const maxGapY =
        H -
        groundHeight -
        pipeGap -
        120;

    const gapY =
        Math.random() *
        (maxGapY - minGapY)
        +
        minGapY;


    pipes.push({

        x: W + 20,

        gapY: gapY,

        passed: false

    });
}


// ==================================================
// UPDATE
// ==================================================

function update() {


    // ==============================================
    // BURUNG
    // ==============================================

    if (holding) {

        bird.velocity += flyPower;

    } else {

        bird.velocity += gravity;

    }


    if (bird.velocity < maxUpSpeed) {

        bird.velocity =
            maxUpSpeed;

    }


    if (bird.velocity > maxDownSpeed) {

        bird.velocity =
            maxDownSpeed;

    }


    bird.y +=
        bird.velocity;


    // ==============================================
    // PIPA
    // ==============================================

    pipeTimer++;


    if (pipeTimer >= pipeDelay) {

        createPipe();

        pipeTimer = 0;
    }


    for (let i = 0; i < pipes.length; i++) {

        const pipe = pipes[i];

        pipe.x -= pipeSpeed;


        // ==========================================
        // SCORE
        // ==========================================

        if (
            !pipe.passed &&
            pipe.x + pipeWidth < bird.x
        ) {

            pipe.passed = true;

            score++;

            scoreText.textContent =
                score;
        }


        // ==========================================
        // COLLISION
        // ==========================================

        const birdLeft =
            bird.x - bird.radius;

        const birdRight =
            bird.x + bird.radius;

        const birdTop =
            bird.y - bird.radius;

        const birdBottom =
            bird.y + bird.radius;


        const pipeLeft =
            pipe.x;

        const pipeRight =
            pipe.x + pipeWidth;


        const touchingPipeX =
            birdRight > pipeLeft &&
            birdLeft < pipeRight;


        if (touchingPipeX) {

            const touchingTopPipe =
                birdTop < pipe.gapY;

            const touchingBottomPipe =
                birdBottom >
                pipe.gapY + pipeGap;


            if (
                touchingTopPipe ||
                touchingBottomPipe
            ) {

                gameOver();

                return;
            }
        }
    }


    // ==============================================
    // HAPUS PIPA
    // ==============================================

    pipes =
        pipes.filter(pipe => {

            return pipe.x > -pipeWidth - 20;

        });


    // ==============================================
    // BATAS ATAS
    // ==============================================

    if (
        bird.y - bird.radius <= 0
    ) {

        gameOver();

        return;
    }


    // ==============================================
    // BATAS BAWAH
    // ==============================================

    const groundHeight = 70;


    if (
        bird.y + bird.radius >=
        H - groundHeight
    ) {

        gameOver();

        return;
    }
}


// ==================================================
// GAMBAR LANGIT
// ==================================================

function drawBackground() {

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    sky.addColorStop(
        0,
        "#55b9d9"
    );

    sky.addColorStop(
        1,
        "#b5e9f2"
    );


    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}


// ==================================================
// GAMBAR TANAH
// ==================================================

function drawGround() {

    const groundHeight = 70;

    ctx.fillStyle =
        "#a7a16b";

    ctx.fillRect(
        0,
        H - groundHeight,
        W,
        groundHeight
    );
}


// ==================================================
// GAMBAR PIPA
// ==================================================

function drawPipes() {

    for (const pipe of pipes) {


        // ==========================================
        // PIPA ATAS
        // ==========================================

        ctx.fillStyle =
            "#3c963f";

        ctx.fillRect(

            pipe.x,

            0,

            pipeWidth,

            pipe.gapY

        );


        // kepala pipa atas

        ctx.fillStyle =
            "#55aa58";

        ctx.fillRect(

            pipe.x - 5,

            pipe.gapY - 25,

            pipeWidth + 10,

            25

        );


        // ==========================================
        // PIPA BAWAH
        // ==========================================

        const bottomY =
            pipe.gapY + pipeGap;

        const groundHeight = 70;


        ctx.fillStyle =
            "#3c963f";

        ctx.fillRect(

            pipe.x,

            bottomY,

            pipeWidth,

            H -
            groundHeight -
            bottomY

        );


        // kepala pipa bawah

        ctx.fillStyle =
            "#55aa58";

        ctx.fillRect(

            pipe.x - 5,

            bottomY,

            pipeWidth + 10,

            25

        );


        // border

        ctx.strokeStyle =
            "#24652a";

        ctx.lineWidth = 3;


        ctx.strokeRect(

            pipe.x,

            0,

            pipeWidth,

            pipe.gapY

        );


        ctx.strokeRect(

            pipe.x,

            bottomY,

            pipeWidth,

            H -
            groundHeight -
            bottomY

        );
    }
}


// ==================================================
// GAMBAR BURUNG
// ==================================================

function drawBird() {

    ctx.font = "40px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        "🐦",
        bird.x,
        bird.y
    );
}


// ==================================================
// DRAW
// ==================================================

function draw() {

    drawBackground();

    drawPipes();

    drawGround();

    drawBird();
}


// ==================================================
// GAME LOOP
// ==================================================

function gameLoop() {

    if (!running) {

        draw();

        return;
    }


    update();

    draw();


    if (running) {

        animationId =
            requestAnimationFrame(
                gameLoop
            );
    }
}


// ==================================================
// KONTROL SENTUH
// ==================================================

canvas.addEventListener(
    "pointerdown",
    function(event) {

        if (!running) {
            return;
        }

        event.preventDefault();

        holding = true;
    }
);


canvas.addEventListener(
    "pointerup",
    function(event) {

        event.preventDefault();

        holding = false;
    }
);


canvas.addEventListener(
    "pointercancel",
    function() {

        holding = false;
    }
);


canvas.addEventListener(
    "pointerleave",
    function() {

        holding = false;
    }
);


// ==================================================
// TOMBOL
// ==================================================

startButton.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        startGame();
    }
);


restartButton.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        startGame();
    }
);


// ==================================================
// KEYBOARD
// ==================================================

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


// ==================================================
// RESIZE
// ==================================================

window.addEventListener(
    "resize",
    resizeGame
);


// ==================================================
// MULAI AWAL
// ==================================================

resizeGame();

draw();