
//Canvas element and 2d context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Constants
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

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

//Drawing function
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

//keyboard
function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        player.isMovingLeft = true;
        console.log('Left key pressed!');
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        player.isMovingRight = true;
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

// Add these two lines to the end of your script:
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

//Game loop
function gameLoop() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    updatePlayer();

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();
