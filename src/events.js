export const gameStartEventName = "game-start";

const gameStartEvent = new CustomEvent(gameStartEventName);

export const startGameEvent = () => {
  dispatchEvent(gameStartEvent);
};
