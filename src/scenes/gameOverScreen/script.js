import {gameOverEventName, retryGame, startGame} from "../../events.js";

const gameOverScreenWrapper = document.getElementById("game-over-screen");
const gameOverFinalScore = document.getElementById("game-over-score")


const retryButton = document.getElementById("game-over-retry-button");

window.addEventListener(gameOverEventName, ({ detail }) => {
  gameOverScreenWrapper.classList.remove("game-over-screen-hidden");
  gameOverFinalScore.textContent = detail.score
});

retryButton.addEventListener("click", () => {
  gameOverScreenWrapper.classList.add("game-over-screen-hidden")
  retryGame()
});
