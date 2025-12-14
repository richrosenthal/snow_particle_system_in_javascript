/**
 * Snow particle system for an HTML5 canvas.
 *
 * Features:
 * - Frame-rate independent movement (uses deltaSeconds).
 * - Auto-resizes the canvas to match its displayed size.
 * - Reinitializes flakes on resize so distribution matches the new dimensions.
 * - Optional wind drift (can vary over time for a natural sway).
 */


// Canvas setup

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let isRunning = true;
let lastFrameTimeMs = 0;


// Configuration

const snowConfig = {
  flakeCount: 3000,

  radiusMin: 1,
  radiusMax: 5,

  speedMin: 10,  // px/s
  speedMax: 40,  // px/s

  // Wind settings (horizontal movement)
  windEnabled: true,

  // Base wind (constant push). Set to 0 for no constant drift.
  windBase: 6, // px/s

  // How strong the wind "sways" over time (adds/subtracts from base).
  windSwayAmplitude: 10, // px/s

  // How fast the sway oscillates (larger = faster changes).
  windSwayFrequency: 0.25, // cycles per second
};

let flakes = [];


// Helpers

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Ensures the canvas internal pixel size matches its on-screen (CSS) size.
 * This prevents blur and keeps coordinate math consistent.
 * @returns {boolean} true if the canvas size changed.
 */
function resizeCanvasToDisplaySize() {
  // clientWidth/Height are the displayed size in CSS pixels.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // canvas.width/height are the internal drawing buffer size.
  const sizeChanged = canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (sizeChanged) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return sizeChanged;
}

/**
 * Initializes snowflake objects based on current canvas size.
 */
function initializeSnowflakes() {
  flakes = [];

  for (let i = 0; i < snowConfig.flakeCount; i++) {
    flakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: randomBetween(snowConfig.radiusMin, snowConfig.radiusMax),
      speed: randomBetween(snowConfig.speedMin, snowConfig.speedMax),
    });
  }
}

/**
 * Computes current wind speed (px/s).
 * Uses a sine wave to create a gentle back-and-forth sway.
 */
function getWindSpeed(nowMs) {
  if (!snowConfig.windEnabled) return 0;

  const t = nowMs / 1000; // seconds
  const sway =
    Math.sin(t * Math.PI * 2 * snowConfig.windSwayFrequency) *
    snowConfig.windSwayAmplitude;

  return snowConfig.windBase + sway;
}

/**
 * Wrap X position so flakes drifting sideways re-enter from the other side.
 */
function wrapHorizontally(flake) {
  if (flake.x < -flake.radius) flake.x = canvas.width + flake.radius;
  if (flake.x > canvas.width + flake.radius) flake.x = -flake.radius;
}


// Update + Render

function update(deltaSeconds, nowMs) {
  const windSpeed = getWindSpeed(nowMs);

  for (const flake of flakes) {
    // Vertical fall
    flake.y += flake.speed * deltaSeconds;

    // Horizontal drift (wind)
    flake.x += windSpeed * deltaSeconds;
    wrapHorizontally(flake);

    // Recycle at bottom -> spawn above top with a new x
    if (flake.y > canvas.height + flake.radius) {
      flake.y = -flake.radius;
      flake.x = Math.random() * canvas.width;
    }
  }
}

function render() {
  // Clear previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#0f1a33";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snowflakes
  ctx.fillStyle = "white";
  for (const flake of flakes) {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}


// Main loop

function loop(nowMs) {
  if (!isRunning) return;

  // Keep canvas sized to element (important if CSS/layout changes)
  const resized = resizeCanvasToDisplaySize();
  if (resized) {
    // Recreate flakes so distribution matches the new canvas dimensions
    initializeSnowflakes();
  }

  // Delta time in seconds (first frame delta = 0 to avoid a jump)
  const deltaSeconds = lastFrameTimeMs ? (nowMs - lastFrameTimeMs) / 1000 : 0;
  lastFrameTimeMs = nowMs;

  update(deltaSeconds, nowMs);
  render();

  requestAnimationFrame(loop);
}

// Initial sizing + flakes
resizeCanvasToDisplaySize();
initializeSnowflakes();

// Start
requestAnimationFrame(loop);


// Optional: controls you can call from elsewhere
// window.stopSnow = () => { isRunning = false; };
// window.startSnow = () => { if (!isRunning) { isRunning = true; lastFrameTimeMs = 0; requestAnimationFrame(loop); } };
