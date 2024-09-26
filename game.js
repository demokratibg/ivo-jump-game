const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Параметри на играта
const gameWidth = canvas.width;
const gameHeight = canvas.height;
let gravity = 0.6;
let jumpStrength = -10;
let isJumping = false;
let isGameOver = false;

// Играч (Иво)
const ivo = {
  x: 50,
  y: gameHeight - 50,
  width: 30,
  height: 50,
  dy: 0, // Вертикална скорост
};

// Препятствия
let obstacles = [];
let obstacleSpeed = 3;
let obstacleGap = 150;
let obstacleFrequency = 100; // Колко фрейма преди ново препятствие
let frameCount = 0;
let score = 0;

// Контроли
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping && !isGameOver) {
    isJumping = true;
    ivo.dy = jumpStrength;
  }
  if (isGameOver && e.code === 'Space') {
    resetGame();
  }
});

// Рендериране на играча
function drawIvo() {
  ctx.fillStyle = '#0095DD';
  ctx.fillRect(ivo.x, ivo.y, ivo.width, ivo.height);
}

// Рендериране на препятствията
function drawObstacles() {
  ctx.fillStyle = '#FF0000';
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Ъпдейт на играта
function updateGame() {
  if (!isGameOver) {
    // Гравитация
    ivo.dy += gravity;
    ivo.y += ivo.dy;

    // Ограничение да не падне под земята
    if (ivo.y > gameHeight - ivo.height) {
      ivo.y = gameHeight - ivo.height;
      isJumping = false;
    }

    // Преместване на препятствията
    obstacles.forEach((obstacle, index) => {
      obstacle.x -= obstacleSpeed;

      // Премахване на препятствия извън екрана
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(index, 1);
        score++;
      }

      // Проверка за колизии
      if (
        ivo.x < obstacle.x + obstacle.width &&
        ivo.x + ivo.width > obstacle.x &&
        ivo.y < obstacle.y + obstacle.height &&
        ivo.y + ivo.height > obstacle.y
      ) {
        isGameOver = true;
      }
    });

    // Добавяне на нови препятствия
    frameCount++;
    if (frameCount % obstacleFrequency === 0) {
      obstacles.push({
        x: gameWidth,
        y: gameHeight - 50,
        width: 30,
        height: 50,
      });
    }
  }
}

// Рендериране на екрана
function drawGame() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  drawIvo();
  drawObstacles();
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Точки: ${score}`, 20, 30);

  if (isGameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Край на играта! Натиснете SPACE за нова игра.', gameWidth / 6, gameHeight / 2);
  }
}

// Функция за рестартиране на играта
function resetGame() {
  isGameOver = false;
  ivo.y = gameHeight - 50;
  ivo.dy = 0;
  obstacles = [];
  score = 0;
  frameCount = 0;
}

// Основна функция за играта
function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Стартиране на играта
gameLoop();
