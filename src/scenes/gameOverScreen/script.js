import { gameOverEventName } from "../../events.js";

const gameOverScreenWrapper = document.getElementById("game-over-screen");

window.addEventListener(gameOverEventName, () => {
  gameOverScreenWrapper.classList.remove("pause-screen-hidden");
});

gameOverScreenWrapper.addEventListener("click", () => {});
