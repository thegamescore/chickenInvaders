import {Ship} from "./entites/Ship.js";
import {Invaders} from "./entites/Invaders.js";
import {Live} from "./entites/Live.js";

import {
  INTERVAL_BETWEEN_SHOOTING_IN_MS,
  LEVEL_TRANSITION_DELAY_MS,
  MODE,
  SHIP_HEIGHT,
  SHIP_START_BOTTOM_OFFSET,
  SHIP_WIDTH,
} from "./utils/gameConfig.js";

import {
  appendInvaderProjectTile,
  appendProjectTile,
  invadersProjectTile,
  projectTiles,
  removeInvadersProjectTile,
  removeProjectile,
  resetEntityRegistry,
  updateAndDrawInvaderShotTelegraphs,
} from './projectTiles.js'

import {availableShootingModes, gameStates, keyMap, MAX_LEVEL_REACHED, pointEvents,} from "../../utils/const.js";
import {keyPressedMap, updateKeyState, updateShipPosition,} from "./controls.js";

import {assert, delay, preloadImages,} from "../../helpers/helpers.js";

import {drawStars, initializeStars, updateStars} from "./stars.js";
import {spawnDeathEffect, spawnHitEffect, spawnShipDamageEffect, updateAndDrawDeathEffects} from "./deathEffects.js";
import {spawnDamageIndicator, updateAndDrawDamageIndicators} from "./damageIndicators.js";
import {createIsOffScreen, isElementCollidingWithShip, isProjectTileCollidingWithInvader,} from "./collisions.js";
import {applyScreenShake, triggerScreenShake, updateScreenShake} from "./screenShake.js";

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
import {PresentsRegistry} from "./entites/PresentsRegistry.js";
import {getData} from "./configData.js";
import {PresentsModule} from "./modules/PresentModule.js";
import {
  pauseMusic,
  playExplosionSound,
  playHitConfirmSound,
  playLevelTransitionSound,
  playPresentCatchSound,
  playShipHitSound,
  resumeMusic,
  startMusic,
  stopMusic
} from "./audio.js";
import "./touchControls.js";


// ------------------- BACKGROUND -------------------

const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
bgGradient.addColorStop(0, "#02020f");
bgGradient.addColorStop(0.5, "#050518");
bgGradient.addColorStop(1, "#000008");

// ------------------- INITIALIZATION  -------------------

const gameStateManager = new GameStateManager();

const presentRegistry = new PresentsRegistry()

const points = new Points({
  [pointEvents.KILL_PROJECTILE]: 5,
  [pointEvents.CATCH_PRESENT]: 100
});

const ship = new Ship({
  width: SHIP_WIDTH,
  height: SHIP_HEIGHT,
  position: { x: canvas.width / 2, y: canvas.height - SHIP_START_BOTTOM_OFFSET },
  velocity: { x: 0, y: 0 },
  numberOfLives: 3,
});


const invaders = new Invaders();

const initializeGame = ({ numberOfInvaders, gridSize }) => {
  invaders.initialize({ numberOfInvaders, gridSize });
  ship.initializeShip();
  initializeStars();
};

window.addEventListener("load", async () => {
  try {
    const data = await getData();

    const { products, levels, maxLevels } = data;

    const preloadedImages =  await  preloadImages(products)



    gameStateManager.setConfig({
      levels: levels,
      maxLevels
    })

    PresentsModule.initialize(
        {
          data,
          currentLevel: gameStateManager.getCurrentLevel.bind(gameStateManager),
          presentRegistry: presentRegistry,
          levels,
          preloadedImages
        }
    );

    const { initialInvaders, initialGridSize  } = gameStateManager.getInitialData()

    initializeGame({
      numberOfInvaders: initialInvaders,
      gridSize: initialGridSize,
    });


  } catch (error) {
    console.error("Error loading game data:", error);
  }
});


const { startPresents, resetPresents } = PresentsModule;


// ------------------- CONSTANTS  -------------------

const isAutoShotMode = MODE === availableShootingModes.AUTO;
const isKeyPressMode = MODE === availableShootingModes.KEY_PRESS;

// ------------------- INTERVALS & EVENTS -------------------

let appendProjectTileIntervalId;
let invadersShootingIntervalId;

const startProjectileIntervalForAutoMode = () => {
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

const cleanUpProjectTile = (projectile, index) => {
  const isOffScreen = checkIfIsOffScreen(projectile.position)

  if (isOffScreen) removeProjectile(index);
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

const cleanUpIntervals = () => {
  clearInterval(invadersShootingIntervalId);
  resetPresents()

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
  startProjectileIntervalForAutoMode();

  startPresents()
};

const startLevelTransition = async () => {
  gameStateManager.updateCurrentLevel();

  const currentLevel = gameStateManager.getCurrentLevel();
  const levelData = gameStateManager.getCurrentLevelData()

  if (currentLevel === MAX_LEVEL_REACHED) {
    gameStateManager.setState(gameStates.WIN);
    return;
  }

  assert(levelData, "Current level not specified");

  cleanUpIntervals();

  dispatchLevelTransition(currentLevel);
  stopMusic();
  playLevelTransitionSound();

  await delay(LEVEL_TRANSITION_DELAY_MS);


  cleanUpScene();
  ship.resetShipPosition();

  presentRegistry.resetPresents()

  invaders.initialize({
    numberOfInvaders: levelData.numberOfInvaders,
    gridSize: levelData.gridSize,
  });

  gameStateManager.setState(gameStates.RUNNING);
  startMusic();
};

gameStateManager.onChange((newState) => {
  if (newState === gameStates.RUNNING) {
    resumeScene();
  }

  if (newState === gameStates.PAUSED) {
    stopInvaderShootingInterval();
    pauseGame();
    cleanUpScene();
    pauseMusic();
  }

  if (newState === gameStates.GAME_OVER) {
    cleanUpScene();
    setGameOver({
      score: points.getTotalPoints(),
    });
    stopMusic();
  }

  if (newState === gameStates.LEVEL_TRANSITION) {
    startLevelTransition();
  }
});

function draw() {
  let GAME_STATE = gameStateManager.getState();

  requestAnimationFrame(draw);

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const numberOfLives = updateLives();
  const invadersOnScreen = invaders.invaders;

  updateScreenShake();
  ctx.save();
  applyScreenShake(ctx);

  updateStars();
  drawStars();
  updateAndDrawDeathEffects();
  updateAndDrawDamageIndicators();

  ship.updateShip();
  updateShipPosition(ship);

  if (GAME_STATE !== gameStates.RUNNING) {
    ctx.restore();
    points.drawPoints(ctx, canvasWidth);
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
  updateAndDrawInvaderShotTelegraphs();

  invadersOnScreen.forEach((invader, invaderIndex) => {
    invader.draw();

    projectTiles.forEach((projectile, projectileIndex) => {
      if (isProjectTileCollidingWithInvader(projectile, invader)) {
        const { earnedPoints, comboMultiplier } = points.updatePoints(pointEvents.KILL_PROJECTILE);
        playExplosionSound();
        playHitConfirmSound();
        spawnDeathEffect(
          invader.position.x + invader.width / 2,
          invader.position.y + invader.height / 2,
        );
        spawnHitEffect(
          invader.position.x + invader.width / 2,
          invader.position.y + invader.height / 2,
        );
        spawnDamageIndicator({
          x: invader.position.x + invader.width / 2,
          y: invader.position.y - 8,
          text: comboMultiplier > 1 ? `+${earnedPoints} x${comboMultiplier}` : `+${earnedPoints}`,
          color: "#8ffaff",
          ttl: 26,
          velocityY: -1.5,
        });
        triggerScreenShake({ intensity: 4.5, duration: 7 });

        setTimeout(() => {
          invadersOnScreen.splice(invaderIndex, 1);
          projectTiles.splice(projectileIndex, 1);
          invaders.recompactRows();
        }, 0);
      }
    });
  });

  presents.forEach(((present, index) => {
    if (isElementCollidingWithShip(present, ship)) {
      presentRegistry.removePresent(index)
      points.updatePoints(pointEvents.CATCH_PRESENT);
      playPresentCatchSound();
    }
  }))


  projectTiles.forEach((projectile, index) => {
    cleanUpProjectTile(projectile, index);
    projectile.update();
  });



  invadersProjectTile.forEach((projectile, index) => {
    if(checkIfIsOffScreen(projectile.position)){
      removeInvadersProjectTile(index);
    }

    if (isElementCollidingWithShip(projectile, ship)) {
      removeInvadersProjectTile(index);
      const isDamaged = ship.destroy();

      if (isDamaged) {
        playShipHitSound();
        spawnShipDamageEffect(
          ship.position.x + ship.width / 2,
          ship.position.y + ship.height / 2,
        );
        spawnDamageIndicator({
          x: ship.position.x + ship.width / 2,
          y: ship.position.y - 12,
          text: "-1 HP",
          color: "#ff7b7b",
          ttl: 34,
          velocityY: -1.1,
        });
        triggerScreenShake({ intensity: 9, duration: 14 });
      }
    }

    projectile.update();
  });

  ctx.restore();
  points.drawPoints(ctx, canvasWidth);
}

draw();

const resetGameBackToInitial = () => {
  cleanUpScene()
  ship.reset()
  points.reset()
  gameStateManager.resetGame()
  presentRegistry.resetPresents()

  const { initialInvaders, initialGridSize  } = gameStateManager.getInitialData()

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
  startMusic();
  gameStateManager.setState(gameStates.RUNNING);
});

window.addEventListener(unpauseGameEventName, () => {
  resumeMusic();
  gameStateManager.setState(gameStates.RUNNING);
});

window.addEventListener(retryGameEventName, () => {
  resetGameBackToInitial();
  startMusic();
  gameStateManager.setState(gameStates.RUNNING);
})
