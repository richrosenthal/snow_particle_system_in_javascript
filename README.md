# snow_particle_system_in_javascript
A simple snow particle system in javascript to be used in JS games and art projects
Author Ricky Rosenthal 12-14-2025
````md

This project is a **simple snow particle system** written in **JavaScript** using the **HTML5 Canvas API**.  
It is designed to be easy to read, modify, and learn from especially for someone just starting to learn to program.

The system renders thousands of small snowflakes that fall smoothly across the screen, supports **frame-rate independent animation**, **window resizing**, and **optional wind drift**.

---

## What Is This?

A **particle system** is a common technique in games and simulations used to display effects like:
* Snow
* Rain
* Fire
* Smoke
* Dust

In this project:
* Each snowflake is a **particle**
* All particles are updated and drawn every frame
* The animation runs using `requestAnimationFrame`

## Demo Behavior

* Snowflakes fall from the top of the screen to the bottom
* When a snowflake goes off-screen, it respawns at the top
* Snowflakes drift sideways due to simulated wind
* The animation automatically adapts when the canvas size changes

---

## Project Structure

This project is a **single JavaScript file** that works with an HTML `<canvas>` element.

### Required HTML

```html
<canvas id="game"></canvas>
````

You should also give the canvas a size using CSS:

```css
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
```


## Key Concepts Used

### 1. HTML5 Canvas

Canvas allows you to draw shapes, images, and animations using JavaScript.

We use:

* `ctx.fillRect()` → background
* `ctx.arc()` → snowflakes
* `ctx.fill()` → draw shapes


### 2. The Game Loop

The animation runs using this pattern:

```js
requestAnimationFrame(loop);
```

Every frame:

1. Calculate how much time passed
2. Update snowflake positions
3. Draw everything to the canvas
4. Repeat

This is the **same structure used in most 2D games**.
 
### 3. Frame-Rate Independent Movement

Instead of moving snowflakes by a fixed amount each frame, we multiply by **delta time**:

```js
flake.y += flake.speed * deltaSeconds;
```

Why this matters:

* Faster computers → more frames
* Slower computers → fewer frames
* Movement speed stays consistent on all machines

---

### 4. Particles (Snowflakes)

Each snowflake is a simple JavaScript object:

```js
{
  x: Number,
  y: Number,
  radius: Number,
  speed: Number
}
```

All snowflakes are stored in an array and updated in a loop.

---

## Configuration

All important values live in one place:

```js
const snowConfig = {
  flakeCount: 3000,
  radiusMin: 1,
  radiusMax: 5,
  speedMin: 10,
  speedMax: 40,

  windEnabled: true,
  windBase: 6,
  windSwayAmplitude: 10,
  windSwayFrequency: 0.25,
};
```

### What These Mean

| Property                | Description                     |
| ----------------------- | ------------------------------- |
| `flakeCount`            | Number of snowflakes on screen  |
| `radiusMin / radiusMax` | Size range of flakes            |
| `speedMin / speedMax`   | Fall speed range (pixels/sec)   |
| `windEnabled`           | Turn wind on/off                |
| `windBase`              | Constant horizontal wind speed  |
| `windSwayAmplitude`     | Strength of wind back-and-forth |
| `windSwayFrequency`     | How fast the wind changes       |

---

## Canvas Resizing

The system automatically detects when the canvas changes size and:

1. Updates the canvas resolution
2. Recreates snowflakes to match the new size

This prevents:

* Blurry rendering
* Incorrect positioning
* Snow spawning outside the screen

---

## Wind Simulation

Wind is simulated using a **sine wave**:

```js
Math.sin(time * frequency) * amplitude
```

This creates a smooth left-to-right drifting motion that looks more natural than constant movement.

---

## How to Use This in Your Own Project

### Step 1: Copy the Code

Copy the JavaScript file into your project.

### Step 2: Add a Canvas

Add this to your HTML:

```html
<canvas id="game"></canvas>
```

### Step 3: Style the Canvas

Make sure the canvas has a size using CSS.

### Step 4: Customize

Try changing:

* `flakeCount`
* Snow speed
* Wind strength
* Background color

---

## License

Free to use, modify, and learn from.

Happy coding! ❄️

```
```
