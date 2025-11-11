
//Canvas element and 2d context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Constants
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
let score = 0;
let isGameOver = false;

//ship setup
const player = {
x: GAME_WIDTH / 2 - 25,
y: GAME_HEIGHT - 60,
width: 50,
height: 50,
speed: 5,
isMovingLeft: false,
isMovingRight: false,
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
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//Player
function drawPlayer(){
    ctx.fillStyle = 'orange';
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
    //boundary
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

//Game Over
function drawGameOver() {
    ctx.fillStyle = 'rbga(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = 'red';
    ctx.font = '48px Courier';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);
//Final score
    ctx.fillStyle = 'white';
    ctx.font = '30px "Courier New"';
    ctx.fillText('Final Score: ${score}', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
//restart
    ctx.font = '20px "Courier New"';
    ctx.fillText('(Refresh to Play Again)', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
    ctx.textAlign = 'left';    
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
    ctx.font = '24px CourierNew';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

//make buttons work
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

//Game loop
function gameLoop() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    if (isGameOver) {
        drawGameOver();
    }else {
        updatePlayer();
        checkPlayerCollision();
    }

    enemySpawnTimer++;
    if (enemySpawnTimer >= ENEMY_SPAWN_RATE) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }

    enemies.forEach(enemy => enemy.update());
    bullets.forEach(bullet => bullet.update());

    runGameLogic();

    drawPlayer();
    drawScore();
    enemies.forEach(enemy => enemy.draw());
    bullets.forEach(bullet => bullet.draw());

    requestAnimationFrame(gameLoop);
}


gameLoop();
