export const gameStartEventName = "game-start";
export const pauseGameEventName = "pause-game";
export const unpauseGameEventName = "unpause-game";
export const gameOverEventName = "game-over";
export const levelTransitionEventName = "level-transition";
export const retryGameEventName = "retry-game"


export const startGame = () => {
  const gameStartEvent = new CustomEvent(gameStartEventName);
  dispatchEvent(gameStartEvent);
};

export const pauseGame = () => {
  const pauseGameEvent = new CustomEvent(pauseGameEventName);
  dispatchEvent(pauseGameEvent);
};

export const unPauseGame = () => {
  const unpauseGameEvent = new CustomEvent(unpauseGameEventName);
  dispatchEvent(unpauseGameEvent)
};

export const retryGame = () => {
  const retryGameEvent = new CustomEvent(retryGameEventName);
  dispatchEvent(retryGameEvent)
}

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
