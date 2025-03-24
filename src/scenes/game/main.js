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

import {
  availableShootingModes,
  gameStates,
  keyMap,
  MAX_LEVEL_REACHED,
  pointEvents,
} from "../../utils/const.js";
import {
  keyPressedMap,
  updateKeyState,
  updateShipPosition,
} from "./controls.js";

import {
  assert,
  delay,
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
import {
  dispatchLevelTransition,
  gameStartEventName,
  pauseGame,
  unpauseGameEventName,
} from "../../events.js";
import { GameStateManager } from "./gameStateManager.js";
import { Points } from "./entites/Points.js";

// ------------------- CONSTANTS & INITIALIZATION -------------------

const isAutoShotMode = MODE === availableShootingModes.AUTO;
const isKeyPressMode = MODE === availableShootingModes.KEY_PRESS;

const projectTiles = [];
const invadersProjectTile = [];

const cleanUpProject = () => {
  projectTiles.length = 0;
  invadersProjectTile.length = 0;
};

const points = new Points({
  [pointEvents.KILL_PROJECTILE]: 5,
});

const ship = new Ship({
  width: SHIP_WIDTH,
  height: SHIP_HEIGHT,
  position: { x: canvas.width / 2, y: canvas.height - 150 },
  velocity: { x: 0, y: 0 },
  numberOfLives: 1,
});

const invaders = new Invaders();

const initializeGame = ({ numberOfInvaders }) => {
  invaders.initialize({ numberOfInvaders, gridSize: 10 });
  ship.initializeShip();
  initializeStars();
};

initializeGame({
  numberOfInvaders: 1,
});

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

let invadersShootingIntervalId;

const startInvadersShootingInterval = () => {
  invadersShootingIntervalId = setInterval(appendInvaderProjectTile, 1000);
};

const stopInvaderShootingInterval = () => {
  clearInterval(invadersShootingIntervalId);
};

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

  return lives.length;
};

// ------------------- GAME LOOP -------------------

const gameStateManager = new GameStateManager({
  maxLevel: 5,
});

const LEVEL_TRANSITION_DELAY_MS = 2000;

const LEVELS = {
  1: {
    numberOfInvaders: 2,
    gridSize: 25,
  },
  2: {
    numberOfInvaders: 3,
    gridSize: 25,
  },
  3: {
    numberOfInvaders: 4,
    gridSize: 25,
  },
};

const startLevelTransition = async () => {
  gameStateManager.updateCurrentLevel();
  const currentLevel = gameStateManager.getCurrentLevel();

  if (currentLevel === MAX_LEVEL_REACHED) {
    gameStateManager.setState(gameStates.WIN);
    return;
  }

  assert(LEVELS[currentLevel], "Current level not specified");

  dispatchLevelTransition(currentLevel);

  const levelData = LEVELS[currentLevel];

  ship.resetShipPosition();

  invaders.initialize({
    numberOfInvaders: levelData.numberOfInvaders,
    gridSize: levelData.gridSize,
  });

  cleanUpProject();

  await delay(LEVEL_TRANSITION_DELAY_MS);

  gameStateManager.setState(gameStates.RUNNING);
};

gameStateManager.onChange((newState) => {
  console.log("NEW STATE", newState);

  if (newState === gameStates.RUNNING) {
    startInvadersShootingInterval();
  }

  if (newState === gameStates.PAUSED) {
    stopInvaderShootingInterval();
    pauseGame();
  }

  if (newState === gameStates.GAME_OVER) {
    stopInvaderShootingInterval();
  }

  if (newState === gameStates.LEVEL_TRANSITION) {
    startLevelTransition();
  }
});

function draw() {
  let GAME_STATE = gameStateManager.getState();

  requestAnimationFrame(draw);

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const numberOfLives = updateLives();
  const invadersOnScreen = invaders.invaders;

  updateStars();
  drawStars();

  points.drawPoints(ctx, canvasWidth);

  ship.updateShip();
  updateShipPosition(ship);

  if (GAME_STATE !== gameStates.RUNNING) {
    return;
  }

  if (GAME_STATE !== gameStates.GAME_OVER && numberOfLives <= 0) {
    gameStateManager.setState(gameStates.GAME_OVER);
  }

  if (
    GAME_STATE !== gameStates.LEVEL_TRANSITION &&
    invadersOnScreen.length <= 0
  ) {
    gameStateManager.setState(gameStates.LEVEL_TRANSITION);
  }

  invaders.update();

  invadersOnScreen.forEach((invader, invaderIndex) => {
    invader.updateInvader({ x: invaders.velocity.x, y: invaders.velocity.y });

    projectTiles.forEach((projectile, projectileIndex) => {
      if (isProjectTileCollidingWithInvader(projectile, invader)) {
        points.updatePoints(pointEvents.KILL_PROJECTILE);

        setTimeout(() => {
          invadersOnScreen.splice(invaderIndex, 1);
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
}

draw();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    const gameState = gameStateManager.getState();

    if (gameState === gameStates.RUNNING) {
      gameStateManager.setState(gameStates.PAUSED);
    }
  }
});

window.addEventListener(gameStartEventName, () => {
  gameStateManager.setState(gameStates.RUNNING);
});

window.addEventListener(unpauseGameEventName, () => {
  gameStateManager.setState(gameStates.RUNNING);
});
