import { Ship } from "./entites/Ship.js";
import { Projectile } from "./entites/Projectile.js";
import { Invaders } from "./entites/Invaders.js";
import { InvaderProjectTile } from "./entites/InvaderProjectTile.js";
import { Live } from "./entites/Live.js";

import {
  INTERVAL_BETWEEN_SHOOTING_IN_MS,
  INVADER_HEIGHT,
  INVADER_WIDTH,
  MODE,
  PROJECT_TILE_DIMENSIONS,
  PROJECT_TILE_SPEED,
  SHIP_HEIGHT,
  SHIP_WIDTH,
} from "./utils/gameConfig.js";

import { availableShootingModes, keyMap } from "../../utils/const.js";
import {
  keyPressedMap,
  updateKeyState,
  updateShipPosition,
} from "./controls.js";

import {
  getRandomArrElement,
  removeProjectile,
} from "../../helpers/helpers.js";

import ProjectTileInvaderImagePng from "../../assets/projecttile-invader.png";

import { drawStars, initializeStars, updateStars } from "./stars.js";
import {
  isProjectTileCollidingWithInvader,
  isProjectTileCollidingWithShip,
} from "./collisions.js";

import { canvas, canvasHeight, canvasWidth, ctx } from "./canvas.js";

// ------------------- CONSTANTS & INITIALIZATION -------------------

const isAutoShotMode = MODE === availableShootingModes.AUTO;
const isKeyPressMode = MODE === availableShootingModes.KEY_PRESS;

const ship = new Ship({
  width: SHIP_WIDTH,
  height: SHIP_HEIGHT,
  position: { x: canvas.width / 2, y: canvas.height - 150 },
  velocity: { x: 0, y: 0 },
});

const invaders = new Invaders();
invaders.initialize({ numberOfInvaders: 40, gridSize: 10 });

const projectTiles = [];
const invadersProjectTile = [];

ship.initializeShip();
initializeStars();

// ------------------- PROJECTILE HANDLING -------------------

const appendProjectTile = () => {
  projectTiles.push(
    new Projectile({
      position: { x: ship.position.x + ship.width / 2, y: ship.position.y },
      velocity: { x: 0, y: PROJECT_TILE_SPEED },
      width: PROJECT_TILE_DIMENSIONS.width,
      height: PROJECT_TILE_DIMENSIONS.height,
    }),
  );
};

const appendInvaderProjectTile = () => {
  const randomInvader = getRandomArrElement(invaders.invaders);
  if (!randomInvader) return;

  invadersProjectTile.push(
    new InvaderProjectTile({
      startPosition: {
        x: randomInvader.position.x + INVADER_WIDTH / 2,
        y: randomInvader.position.y + INVADER_HEIGHT / 2,
      },
      targetPosition: { x: ship.position.x, y: ship.position.y },
      speed: 4,
      width: 50,
      height: 50,
      imagePng: ProjectTileInvaderImagePng,
    }),
  );
};

// ------------------- INTERVALS & EVENTS -------------------

if (isAutoShotMode) {
  setInterval(appendProjectTile, INTERVAL_BETWEEN_SHOOTING_IN_MS);
}

const invadersShootingInterval = setInterval(appendInvaderProjectTile, 1000);

window.addEventListener("keydown", (event) => {
  if (isKeyPressMode && event.code === keyMap.SHOT && !keyPressedMap["SHOT"]) {
    setTimeout(appendProjectTile, 0);
  }
  updateKeyState(event, true);
});

window.addEventListener("keyup", (event) => updateKeyState(event, false));

// ------------------- UTILITIES -------------------

const cleanUpProjectTile = (projectile, index, list) => {
  const isOffScreen =
    projectile.position.x < 0 ||
    projectile.position.x > canvasWidth ||
    projectile.position.y < 0 ||
    projectile.position.y > canvasHeight;

  if (isOffScreen) removeProjectile(list, index);
};

const updateLives = () => {
  const lives = Array.from(
    { length: ship.getShipLives() },
    (_, i) =>
      new Live({
        width: 100,
        height: 100,
        position: { x: 50 * i + 50, y: 15 },
      }),
  );

  lives.forEach((live) => live.draw());
};

// ------------------- GAME LOOP -------------------

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updateLives();
  updateStars();
  drawStars();

  ship.updateShip();
  updateShipPosition(ship);
  invaders.update();

  invaders.invaders.forEach((invader, invaderIndex) => {
    invader.updateInvader({ x: invaders.velocity.x, y: invaders.velocity.y });

    projectTiles.forEach((projectile, projectileIndex) => {
      if (isProjectTileCollidingWithInvader(projectile, invader)) {
        setTimeout(() => {
          invaders.invaders.splice(invaderIndex, 1);
          projectTiles.splice(projectileIndex, 1);
        }, 0);
      }
    });
  });

  projectTiles.forEach((projectile, index) => {
    cleanUpProjectTile(projectile, index, projectTiles);
    projectile.update();
  });

  invadersProjectTile.forEach((projectile, index) => {
    if (isProjectTileCollidingWithShip(projectile, ship)) {
      removeProjectile(invadersProjectTile, index);
      ship.destroy();
    }
    projectile.update();
  });

  if (invaders.invaders.length === 0) {
    clearInterval(invadersShootingInterval);
  }
}

draw();
