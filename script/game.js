
//Canvas element and 2d context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Constants
const replayButton = document.getElementById('replayButton');
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
let score = 0;
let isGameOver = false;

//starfield
const STARS_COUNT = 100;
const STAR_SPEED = 0.5;
let stars = [];

function initStars() {
    for (let i = 0; i < STARS_COUNT; i++) {
        stars.push({
            x: Math.random() * GAME_WIDTH,
            y: Math.random() * GAME_HEIGHT,
            size: Math.random() * 2 + 0.5,
            color: 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.5) + ')',
        });
    }
}

//ship setup
const player = {
x: GAME_WIDTH / 2 - 25,
y: GAME_HEIGHT - 60,
width: 50,
height: 50,
speed: 5,
isMovingLeft: false,
isMovingRight: false
};

//Bullets
let bullets = [];
const BULLET_SPEED = 7;
const BULLET_WIDTH = 3;
const BULLET_HEIGHT = 15;

//Enemies
let enemies = [];
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 30;
const ENEMY_SPEED = .5;

//Tick/ Timer
let enemySpawnTimer = 0;
const ENEMY_SPAWN_RATE = 60;

//Bullets
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        this.speed = BULLET_SPEED;
        this.isDestroyed = false;
    }
    update() {
        this.y -= this.speed;
    }
    draw() {
        ctx.fillStyle = 'rgba(50, 205, 50, 0.4)';
        ctx.fillRect(this.x - 1, this.y, this.width + 2, this.height + 5);
        ctx.fillStyle = 'limegreen';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
function fireBullet() {
    const bulletX = player.x + player.width / 2 - (BULLET_WIDTH / 2);
    const bulletY = player.y;
    bullets.push(new Bullet(bulletX, bulletY));
}

//Enemies
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
        this.speed = ENEMY_SPEED;
        this.isDestroyed = false;
    }
    update() {
        this.y += this.speed;
    }
    draw() {
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;

        ctx.fillStyle = 'cyan';
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + h);
        ctx.lineTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'red';
        ctx.fillRect(x + w * 0.35, y + h * 0.15, w * 0.3, h * 0.3);
    }
}

function drawStars() {
    stars.forEach(star => {
        star.y += STAR_SPEED * star.size;

        if(star.y > GAME_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * GAME_WIDTH;
        }
        ctx.fillStyle = star.color;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

//Player
function drawPlayer(){
    ctx.fillStyle = '#CEFF00';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
 }

//update player
function updatePlayer() {
    if (player.isMovingLeft) {
        player.x -= player.speed;
    }
    if (player.isMovingRight) {
        player.x += player.speed;
    }
    //Player boundary
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > GAME_WIDTH) {
        player.x = GAME_WIDTH - player.width;
    }
}

//spawn enemies
function spawnEnemy() {
    const enemyX = Math.random() * (GAME_WIDTH - ENEMY_WIDTH);
    const enemyY = - ENEMY_HEIGHT;

    enemies.push(new Enemy(enemyX, enemyY));
}

//Game logic/ bullet and enemy collision
function runGameLogic() {
    enemies.forEach(enemy => {
        bullets.forEach(bullet => {
            if (checkCollision(bullet, enemy)) {
                enemy.isDestroyed = true;
                bullet.isDestroyed = true;
                score += 10;
            }
        });
    });
    enemies = enemies.filter(enemy => !enemy.isDestroyed && enemy.y < GAME_HEIGHT);
    bullets = bullets.filter(bullet => !bullet.isDestroyed && bullet.y > 0);
}

//collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
function checkPlayerCollision() {
    enemies.forEach(enemy => {
        if (checkCollision(player, enemy)) {
            isGameOver = true;
        }
    });
}

//keyboard
function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        player.isMovingLeft = true;
        console.log('Left key pressed!');
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        player.isMovingRight = true;
    }
    if (event.key === ' ') {
        fireBullet();
    }
}
function handleKeyUp(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        player.isMovingLeft = false;
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        player.isMovingRight = false;
    }
}

//score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px "Courier New"';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

//make buttons work
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

//Gameplay loop
function gameLoop() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    if (isGameOver) {
        drawGameOver();
    } else {
        updatePlayer();
        checkPlayerCollision();
        
        enemySpawnTimer++;
        if (enemySpawnTimer >= ENEMY_SPAWN_RATE) {
            spawnEnemy();
            enemySpawnTimer = 0;
        }

        enemies.forEach(enemy => enemy.update());
        bullets.forEach(bullet => bullet.update());

        runGameLogic();
    
        drawStars();
        drawPlayer();
        enemies.forEach(enemy => enemy.draw());
        bullets.forEach(bullet => bullet.draw());
        drawScore();
        
    }
    
    requestAnimationFrame(gameLoop);
}

//Game Over
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = 'red';
    ctx.font = '48px Courier';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);
//Final score
    ctx.fillStyle = 'white';
    ctx.font = '30px "Courier New"';
    ctx.fillText(`Final Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
//replay
replayButton.style.display = 'block';
replayButton.style.position = 'absolute';
const buttonWidth = 120;
const buttonLeft = canvas.offsetLeft + GAME_WIDTH / 2 - (buttonWidth / 2);
replayButton.style.top = `${canvas.offsetTop + GAME_HEIGHT / 2 + 60}px`;
replayButton.style.left = `${buttonLeft}px`;
replayButton.style.width = `${buttonWidth}px`;
ctx.textAlign = 'left';
}

function resetGame() {
    isGameOver = false;
    score = 0;
    enemySpawnTimer = 0;

    enemies = [];
    bullets = [];

    player.x = GAME_WIDTH / 2 - player.width / 2;
    player.isMovingLeft = false;
    player.isMovingRight = false;

    replayButton.style.display = 'none';
}
replayButton.addEventListener('click', resetGame);

initStars();
gameLoop();
