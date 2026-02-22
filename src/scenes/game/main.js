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
  appendSpreadProjectTiles,
  invadersProjectTile,
  projectTiles,
  removeInvadersProjectTile,
  removeProjectile,
  resetEntityRegistry,
  updateAndDrawInvaderShotTelegraphs,
} from './projectTiles.js'

import {availableShootingModes, gameStates, keyMap, MAX_LEVEL_REACHED, pointEvents, POWER_UP_TYPES} from "../../utils/const.js";
import {keyPressedMap, updateKeyState, updateShipPosition,} from "./controls.js";

import {assert, delay, getRandomArrElement, preloadImages, setRandomInterval} from "../../helpers/helpers.js";

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
import {PowerUp} from "./entites/PowerUp.js";
import {BombProjectile, BOMB_EXPLOSION_RADIUS} from "./entites/BombProjectile.js";
import {PowerUpHandler, RAPID_FIRE_INTERVAL_MS} from "./powerUpHandler.js";
import {Boss} from "./entites/Boss.js";
import {BossBomb} from "./entites/BossBomb.js";
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
  numberOfLives: 5,
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

const powerUps = [];
let powerUpSpawnerHandle = null;
let bombProjectile = null;
const powerUpHandler = new PowerUpHandler();

let boss = null;
const bossBombs = [];

const isBossLevel = () => gameStateManager.getCurrentLevel() % 2 === 1;

const restartProjectileInterval = () => {
  clearInterval(appendProjectTileIntervalId);
  if (!isAutoShotMode) return;
  const ms = powerUpHandler.isRapidFireActive() ? RAPID_FIRE_INTERVAL_MS : INTERVAL_BETWEEN_SHOOTING_IN_MS;
  const fn = powerUpHandler.isSpreadShotActive() ? appendSpreadProjectTiles({ship}) : appendProjectTile({ship});
  appendProjectTileIntervalId = setInterval(fn, ms);
};

const startPowerUpSpawner = () => {
  powerUpSpawnerHandle = setRandomInterval(() => {
    if (powerUps.length >= 3) return;
    const type = getRandomArrElement(Object.values(POWER_UP_TYPES));
    powerUps.push(new PowerUp({
      type,
      position: { x: Math.random() * (canvasWidth - 40), y: -40 },
      width: 40,
      height: 40,
    }));
  }, 5000, 9000);
};

const stopPowerUpSpawner = () => {
  powerUpSpawnerHandle?.clear();
  powerUpSpawnerHandle = null;
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
  if (event.code === keyMap.SHOT && powerUpHandler.isBombReady() && !bombProjectile) {
    if (gameStateManager.getState() === gameStates.RUNNING) {
      powerUpHandler.consumeBomb();
      bombProjectile = new BombProjectile({
        position: { x: ship.position.x + ship.width / 2 - 16, y: ship.position.y - 32 },
      });
    }
  } else if (isKeyPressMode && event.code === keyMap.SHOT && !keyPressedMap["SHOT"]) {
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

const handlePowerUpCollision = (type, x, y) => {
  const indicatorBase = { x, y: y - 16, ttl: 40, velocityY: -1.4 };
  if (type === POWER_UP_TYPES.RAPID_FIRE) {
    powerUpHandler.activateRapidFire(() => restartProjectileInterval());
    restartProjectileInterval();
    spawnDamageIndicator({ ...indicatorBase, text: "⚡ RAPID FIRE!", color: "#ffaa00" });
  }
  if (type === POWER_UP_TYPES.SPREAD_SHOT) {
    powerUpHandler.activateSpreadShot(() => restartProjectileInterval());
    restartProjectileInterval();
    spawnDamageIndicator({ ...indicatorBase, text: "» SPREAD SHOT!", color: "#8ffaff" });
  }
  if (type === POWER_UP_TYPES.BOMB) {
    powerUpHandler.activateBomb();
    spawnDamageIndicator({ ...indicatorBase, text: "★ BOMB! PRESS SPACE", color: "#ff4fff" });
  }
};

// ------------------- GAME LOOP -------------------

const cleanUpIntervals = () => {
  clearInterval(invadersShootingIntervalId);
  bossBombs.length = 0;
  resetPresents();
  stopPowerUpSpawner();
  powerUps.length = 0;
  bombProjectile = null;

  if (isAutoShotMode) {
    clearInterval(appendProjectTileIntervalId);
  }
};

const cleanUpScene = () => {
  resetEntityRegistry();
  cleanUpIntervals();
};

const resumeScene = () => {
  if (!isBossLevel()) {
    startInvadersShootingInterval();
  }
  restartProjectileInterval();
  startPresents();
  startPowerUpSpawner();
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
  powerUps.length = 0;
  powerUpHandler.reset();

  dispatchLevelTransition(currentLevel);
  stopMusic();
  playLevelTransitionSound();

  await delay(LEVEL_TRANSITION_DELAY_MS);


  cleanUpScene();
  ship.resetShipPosition();

  presentRegistry.resetPresents()

  if (isBossLevel()) {
    boss = new Boss({ canvasWidth, canvasHeight });
    invaders.initialize({ numberOfInvaders: 0, gridSize: 1 });
  } else {
    boss = null;
    invaders.initialize({
      numberOfInvaders: levelData.numberOfInvaders,
      gridSize: levelData.gridSize,
    });
  }

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

  if (GAME_STATE !== gameStates.LEVEL_TRANSITION) {
    if (isBossLevel()) {
      if (boss && boss.isDead) {
        gameStateManager.setState(gameStates.LEVEL_TRANSITION);
      }
    } else if (invadersOnScreen.length <= 0) {
      gameStateManager.setState(gameStates.LEVEL_TRANSITION);
    }
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
        const ix = invader.position.x + invader.width / 2;
        const iy = invader.position.y + invader.height / 2;
        const isDead = invader.hit();

        if (isDead) {
          const { earnedPoints, comboMultiplier } = points.updatePoints(pointEvents.KILL_PROJECTILE);
          playExplosionSound();
          playHitConfirmSound();
          spawnDeathEffect(ix, iy);
          spawnHitEffect(ix, iy);
          spawnDamageIndicator({
            x: ix,
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
        } else {
          playHitConfirmSound();
          spawnHitEffect(ix, iy);
          triggerScreenShake({ intensity: 2, duration: 4 });
          setTimeout(() => {
            projectTiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });

  // Boss update, draw, projectile collision, enrage, and shooting
  if (boss && !boss.isDead) {
    boss.update();
    boss.draw();

    for (let pi = projectTiles.length - 1; pi >= 0; pi--) {
      const proj = projectTiles[pi];
      if (isProjectTileCollidingWithInvader(proj, boss)) {
        const isDead = boss.hit(1);
        const bx = boss.position.x + boss.width / 2;
        const by = boss.position.y + boss.height / 2;
        playHitConfirmSound();
        spawnHitEffect(bx, by);
        spawnDamageIndicator({
          x: bx,
          y: boss.position.y - 8,
          text: isDead ? '★ BOSS DOWN! ★' : `-1`,
          color: '#ff4444',
          ttl: isDead ? 50 : 22,
          velocityY: -1.5,
        });
        triggerScreenShake({ intensity: isDead ? 14 : 3, duration: isDead ? 22 : 5 });
        projectTiles.splice(pi, 1);
        if (isDead) {
          playExplosionSound();
          spawnDeathEffect(bx, by);
          points.totalPoints += 10000;
        }
      }
    }

    // Enrage phase transition
    if (boss.consumeEnrageEvent()) {
      triggerScreenShake({ intensity: 20, duration: 35 });
      spawnDamageIndicator({
        x: boss.position.x + boss.width / 2,
        y: boss.position.y + boss.height / 2,
        text: '⚠ ENRAGED!',
        color: '#ff4400',
        ttl: 70,
        velocityY: -0.5,
      });
    }

    // Self-managed boss shooting
    const newBombs = boss.getNewBombs();
    if (newBombs) {
      newBombs.forEach(b => bossBombs.push(new BossBomb({ ...b, canvasHeight })));
    }
  }

  // Boss bombs update, draw, and ship collision
  for (let bi = bossBombs.length - 1; bi >= 0; bi--) {
    const bomb = bossBombs[bi];
    if (bomb.isOffScreen()) { bossBombs.splice(bi, 1); continue; }
    bomb.update();
    if (isElementCollidingWithShip(bomb, ship)) {
      bossBombs.splice(bi, 1);
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
  }

  presents.forEach(((present, index) => {
    if (isElementCollidingWithShip(present, ship)) {
      presentRegistry.removePresent(index)
      points.updatePoints(pointEvents.CATCH_PRESENT);
      playPresentCatchSound();
    }
  }))

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const pu = powerUps[i];
    pu.updatePowerUp({ x: 0, y: 3 });
    if (pu.position.y > canvasHeight) { powerUps.splice(i, 1); continue; }
    if (isElementCollidingWithShip(pu, ship)) {
      powerUps.splice(i, 1);
      handlePowerUpCollision(pu.type, pu.position.x + pu.width / 2, pu.position.y);
    }
  }

  if (bombProjectile) {
    bombProjectile.update();
    if (bombProjectile.position.y + bombProjectile.height < 0) {
      bombProjectile = null;
    } else {
      const bx = bombProjectile.position.x + bombProjectile.width / 2;
      const by = bombProjectile.position.y + bombProjectile.height / 2;
      const hitIndex = invadersOnScreen.findIndex(inv => {
        const ix = inv.position.x + inv.width / 2;
        const iy = inv.position.y + inv.height / 2;
        const dx = bx - ix;
        const dy = by - iy;
        return Math.sqrt(dx * dx + dy * dy) < bombProjectile.width / 2 + inv.width / 2;
      });
      if (hitIndex !== -1) {
        // Explode: kill all invaders within radius
        for (let i = invadersOnScreen.length - 1; i >= 0; i--) {
          const inv = invadersOnScreen[i];
          const ix = inv.position.x + inv.width / 2;
          const iy = inv.position.y + inv.height / 2;
          const dx = bx - ix;
          const dy = by - iy;
          if (Math.sqrt(dx * dx + dy * dy) < BOMB_EXPLOSION_RADIUS) {
            spawnDeathEffect(ix, iy);
            spawnHitEffect(ix, iy);
            invadersOnScreen.splice(i, 1);
          }
        }
        invaders.recompactRows();
        triggerScreenShake({ intensity: 14, duration: 22 });
        bombProjectile = null;
      }
    }
  }

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

  if (GAME_STATE === gameStates.RUNNING && boss && !boss.isDead) {
    boss.drawHpBar();
  }

  if (GAME_STATE === gameStates.RUNNING && powerUpHandler.isBombReady()) {
    const pulse = 0.55 + 0.45 * Math.sin(Date.now() * 0.006);
    ctx.save();
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ff4fff';
    ctx.shadowBlur = 14 * pulse;
    ctx.fillStyle = `rgba(255, 79, 255, ${pulse})`;
    ctx.fillText('★ BOMB READY — PRESS SPACE', 20, canvasHeight - 30);
    ctx.restore();
  }
}

draw();

const resetGameBackToInitial = () => {
  cleanUpScene();
  powerUpHandler.reset();
  powerUps.length = 0;
  boss = null;
  ship.reset();
  points.reset();
  gameStateManager.resetGame();
  presentRegistry.resetPresents();

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
