export const gameStartEventName = "game-start";
export const pauseGameEventName = "pause-game"
export const unpauseGameEventName = "unpause-game"

const gameStartEvent = new CustomEvent(gameStartEventName);
const pauseGameEvent = new CustomEvent(pauseGameEventName)
const unpauseGameEvent = new CustomEvent(unpauseGameEventName)

export const startGame = () => {
  dispatchEvent(gameStartEvent);
};

export const pauseGame = () => {
  dispatchEvent(pauseGameEvent);
};

export const unPauseGame = () => {
  dispatchEvent(unpauseGameEvent);
};

