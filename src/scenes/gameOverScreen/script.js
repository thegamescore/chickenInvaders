import { gameOverEventName } from "../../events.js";

const gameOverScreenWrapper = document.getElementById("game-over-screen");
const retryButton = document.getElementById("retry-button");

window.addEventListener(gameOverEventName, ({ detail }) => {
  gameOverScreenWrapper.classList.remove("game-over-screen-hidden");
});

retryButton.addEventListener("click", () => {});
