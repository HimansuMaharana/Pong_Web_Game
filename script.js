// Get Elements
const welcomeScreen = document.getElementById("welcome-screen");
const difficultyScreen = document.getElementById("difficulty-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const scoreDisplay = document.getElementById("score");
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Canvas Settings
canvas.width = 800;
canvas.height = 500;

// Game Variables
let playerScore = 0;
let aiScore = 0;
let difficulty = "medium";
let ball, player, ai;
let gameInterval;
let ballSpeed = 5;

// Show Difficulty Selection
function showDifficultyScreen() {
    welcomeScreen.style.display = "none";
    difficultyScreen.style.display = "block";
}

// Start Game
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    difficultyScreen.style.display = "none";
    gameScreen.style.display = "flex";
    resetGame();
    gameInterval = setInterval(updateGame, 1000 / 60);
}

// Reset Game
function resetGame() {
    playerScore = 0;
    aiScore = 0;
    ballSpeed = difficulty === "easy" ? 4 : difficulty === "hard" ? 6 : 5;
    
    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 8,
        dx: ballSpeed,
        dy: ballSpeed
    };

    player = { x: 10, y: canvas.height / 2 - 40, width: 10, height: 80 };
    ai = { x: canvas.width - 20, y: canvas.height / 2 - 40, width: 10, height: 80 };
}

// Update Game Loop
function updateGame() {
    moveBall();
    moveAI();
    checkCollisions();
    drawGame();
}

// Ball Movement
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce Off Top & Bottom Walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.dy *= -1;
    }

    // Check if Player or AI Missed
    if (ball.x < 0) {
        aiScore++;
        updateScore(); // Update score with animation
        resetBall();
    } else if (ball.x > canvas.width) {
        playerScore++;
        updateScore(); // Update score with animation
        resetBall();
    }
}

// Reset Ball Position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);

    if (aiScore >= 5 || playerScore >= 5) {
        endGame();
    }
}

// AI Paddle Movement
function moveAI() {
    let speed = difficulty === "easy" ? 3 : difficulty === "hard" ? 6 : 4;
    if (ball.y > ai.y + ai.height / 2) {
        ai.y += speed;
    } else {
        ai.y -= speed;
    }
}

// Handle Paddle Collisions
function checkCollisions() {
    if (
        ball.x - ball.radius <= player.x + player.width &&
        ball.y >= player.y &&
        ball.y <= player.y + player.height
    ) {
        ball.dx *= -1;
    }

    if (
        ball.x + ball.radius >= ai.x &&
        ball.y >= ai.y &&
        ball.y <= ai.y + ai.height
    ) {
        ball.dx *= -1;
    }
}

// Draw Game Elements
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Paddles
    ctx.fillStyle = "#0ff";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    // Draw Ball
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Score
    scoreDisplay.innerText = `Player: ${playerScore} | AI: ${aiScore}`;
}

// Update Score with Animation
function updateScore() {
    scoreDisplay.classList.add("score-update"); // Add animation class
    setTimeout(() => {
        scoreDisplay.classList.remove("score-update"); // Remove after animation
    }, 300);
}

// Handle Player Paddle Movement
document.addEventListener("mousemove", (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseY = event.clientY - rect.top;
    player.y = Math.max(Math.min(mouseY - player.height / 2, canvas.height - player.height), 0);
});

// End Game
function endGame() {
    clearInterval(gameInterval);
    gameScreen.style.display = "none";
    gameOverScreen.style.display = "block";
}

// Return to Home
function goToHome() {
    gameOverScreen.style.display = "none";
    welcomeScreen.style.display = "block";
}
