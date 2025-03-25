export const gameStartEventName = "game-start";
export const pauseGameEventName = "pause-game";
export const unpauseGameEventName = "unpause-game";
export const gameOverEventName = "game-over";
export const levelTransitionEventName = "level-transition";

const gameStartEvent = new CustomEvent(gameStartEventName);
const pauseGameEvent = new CustomEvent(pauseGameEventName);
const unpauseGameEvent = new CustomEvent(unpauseGameEventName);

export const startGame = () => {
  dispatchEvent(gameStartEvent);
};

export const pauseGame = () => {
  dispatchEvent(pauseGameEvent);
};

export const unPauseGame = () => {
  dispatchEvent(unpauseGameEvent);
};

export const setGameOver = ({ score }) => {
  const gameOverEvent = new CustomEvent(gameOverEventName, {
    detail: {
      score,
    },
  });

  dispatchEvent(gameOverEvent);
};

export const dispatchLevelTransition = (currentLevel) => {
  const levelTransitionEvent = new CustomEvent(levelTransitionEventName, {
    detail: {
      currentLevel,
    },
  });

  dispatchEvent(levelTransitionEvent);
};
