import {Ship} from "./entites/Ship.js";
import {Invaders} from "./entites/Invaders.js";
import {Live} from "./entites/Live.js";

import {
  INTERVAL_BETWEEN_SHOOTING_IN_MS,
  LEVEL_TRANSITION_DELAY_MS,
  LEVELS,
  MODE,
  SHIP_HEIGHT,
  SHIP_WIDTH,
} from "./utils/gameConfig.js";
import {
  appendInvaderProjectTile,
  appendProjectTile,
  invadersProjectTile,
  projectTiles, removeInvadersProjectTile,
  removeProjectile,
  resetEntityRegistry
} from './projectTiles.js'

import {availableShootingModes, gameStates, keyMap, MAX_LEVEL_REACHED, pointEvents,} from "../../utils/const.js";
import {keyPressedMap, updateKeyState, updateShipPosition,} from "./controls.js";

import {assert, delay,} from "../../helpers/helpers.js";


import {drawStars, initializeStars, updateStars} from "./stars.js";
import {createIsOffScreen, isProjectTileCollidingWithInvader, isProjectTileCollidingWithShip,} from "./collisions.js";

import {canvas, canvasHeight, canvasWidth, ctx} from "./canvas.js";
import {
  dispatchLevelTransition,
  gameStartEventName,
  pauseGame,
  retryGameEventName,
  setGameOver,
  unpauseGameEventName,
} from "../../events.js";
import {GameStateManager} from "./gameStateManager.js";
import {Points} from "./entites/Points.js";
import {Present} from "./entites/Present.js";
import {PresentsRegistry} from "./entites/PresentsRegistry.js";


// ------------------- CONSTANTS & INITIALIZATION -------------------

const isAutoShotMode = MODE === availableShootingModes.AUTO;
const isKeyPressMode = MODE === availableShootingModes.KEY_PRESS;

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

const initializeGame = ({ numberOfInvaders, gridSize }) => {
  invaders.initialize({ numberOfInvaders, gridSize });
  ship.initializeShip();
  initializeStars();
};

const initialInvaders = LEVELS[0].numberOfInvaders
const initialGridSize = LEVELS[0].gridSize

initializeGame({
  numberOfInvaders: initialInvaders,
  gridSize: initialGridSize,
});

// ------------------- INTERVALS & EVENTS -------------------

let appendProjectTileIntervalId;
let invadersShootingIntervalId;

const startProjecttileIntervalForAutoMode = () => {
  if (!isAutoShotMode) {
    return;
  }

  appendProjectTileIntervalId = setInterval(
    appendProjectTile({ship}),
    INTERVAL_BETWEEN_SHOOTING_IN_MS,
  );
};

const startInvadersShootingInterval = () => {
  invadersShootingIntervalId = setInterval(appendInvaderProjectTile({
    invaders: invaders.invaders,
    ship
  }), 1000);
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

const checkIfIsOffScreen = createIsOffScreen(canvasWidth, canvasHeight);

const cleanUpProjectTile = (projectile, index, list) => {
  const isOffScreen = checkIfIsOffScreen(projectile.position)

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

const maxLevel = 4;

assert(
  maxLevel === Object.keys(LEVELS).length,
  "Please, specify all levels. Max levels and LEVELS from" +
    "config must be the same",
);

const gameStateManager = new GameStateManager({
  maxLevel,
});

const cleanUpIntervals = () => {
  clearInterval(invadersShootingIntervalId);

  if (isAutoShotMode) {
    clearInterval(appendProjectTileIntervalId);
  }
};

const cleanUpScene = () => {
  resetEntityRegistry();
  cleanUpIntervals();
};

const resumeScene = () => {
  startInvadersShootingInterval();
  startProjecttileIntervalForAutoMode();
};

const presentRegistry = new PresentsRegistry()

setInterval(() => {
  const present = new Present({
    width: 50,
    height: 50,
    position: { x: Math.floor(Math.random() * canvas.height), y: 50 },
    velocity: { x: 0, y: 0 },
  });

  presentRegistry.appendPresent(present)
}, 1000)


const startLevelTransition = async () => {
  gameStateManager.updateCurrentLevel();

  const currentLevel = gameStateManager.getCurrentLevel();
  const levelData = LEVELS[currentLevel];

  if (currentLevel === MAX_LEVEL_REACHED) {
    gameStateManager.setState(gameStates.WIN);
    return;
  }

  assert(levelData, "Current level not specified");

  dispatchLevelTransition(currentLevel);
  cleanUpScene();

  ship.resetShipPosition();

  presentRegistry.resetPresents()

  invaders.initialize({
    numberOfInvaders: levelData.numberOfInvaders,
    gridSize: levelData.gridSize,
  });

  await delay(LEVEL_TRANSITION_DELAY_MS);

  gameStateManager.setState(gameStates.RUNNING);
};

gameStateManager.onChange((newState) => {
  if (newState === gameStates.RUNNING) {
    resumeScene();
  }

  if (newState === gameStates.PAUSED) {
    stopInvaderShootingInterval();
    pauseGame();
  }

  if (newState === gameStates.GAME_OVER) {
    cleanUpScene();
    setGameOver({
      score: points.getTotalPoints(),
    });
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

  const presents = presentRegistry.getPresents()

  presents.forEach(present => {
    present.updatePresent({
      x: 0,
      y: 5
    })
  })

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
    if(checkIfIsOffScreen(projectile.position)){
      removeInvadersProjectTile(invadersProjectTile, index);
    }

    if (isProjectTileCollidingWithShip(projectile, ship)) {
      removeProjectile(invadersProjectTile, index);
      ship.destroy();
    }

    projectile.update();
  });
}

draw();

const resetGameBackToInitial = () => {
  cleanUpScene()
  ship.reset()
  points.reset()
  gameStateManager.resetGame()
  presentRegistry.resetPresents()

  invaders.initialize({
    numberOfInvaders: initialInvaders,
    gridSize: initialGridSize
  })
}

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

window.addEventListener(retryGameEventName, () => {
  resetGameBackToInitial()
  gameStateManager.setState(gameStates.RUNNING);
})

