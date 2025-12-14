//This is a simple snow particle system that can be used in games and other JS projects
//


//Canvas setup
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d")
gameIsRunning = true;

//user for frame rate-independent movement
let previousFrameTime = 0;

//Snow particle system
const snowSettings = {
    flakeCount: 3000,
    minRadius: 1,
    maxRadius: 5,
    minSpeed: 10,
    maxSpeed: 40,
}

let snowflakes = [];

function createSnowflakes(){
    snowflakes = [];

    for(let i = 0; i < snowSettings.flakeCount; i++){
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius:
                snowSettings.minRadius +
                Math.random() * (snowSettings.maxRadius - snowSettings.minRadius),
            speed:
            snowSettings.minSpeed +
            Math.random() * (snowSettings.maxSpeed - snowSettings.minSpeed)
        });
    }
}

createSnowflakes();

// Animation Update (runs every frame)
function updateGame(deltaTime){

    for (const flake of snowflakes){
        flake.y += flake.speed * deltaTime;
//If snowflake goes off screen, reset to top
        if (flake.y > canvas.height){
            flake.y = -flake.radius;
            flake.x = Math.random() * canvas.clientWidth;
        }
    }
}
//Draw animation
function drawGame(){
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw background
    ctx.fillStyle = "#0f1a33"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw snow
    ctx.fillStyle = "white";
    for (const flake of snowflakes){
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

//Animation Loop
function gameLoop(currentTime){
    if (!gameIsRunning) return;

    //convert from milliseconds to seconds
    const deltaTime = (currentTime - previousFrameTime) / 1000;
    previousFrameTime = currentTime;

    updateGame(deltaTime);
    drawGame();

    requestAnimationFrame(gameLoop);
}

//start animation
requestAnimationFrame(gameLoop);