import {gameReadyEventName, startGame} from "../../events.js";
import {getData} from "../game/configData.js";

const startButton = document.getElementById("start-button");
const chickenInvadersCanvas = document.getElementById(
  "chicken-invaders-canvas",
);
const startScreenWrapper = document.getElementById("start-screen");
const loadingAssetsInfo = document.getElementById("loading-assets-info");
const touchControls = document.getElementById("touch-controls");


window.addEventListener("load",  getData);

window.addEventListener(gameReadyEventName, () => {
    loadingAssetsInfo.classList.add("loading-assets-hidden")
    startButton.disabled = false
    startButton.focus()
})

startButton.addEventListener("click", () => {
  chickenInvadersCanvas.classList.add("chicken-invaders-visible");
  startScreenWrapper.classList.add("start-screen-hidden");
  touchControls.classList.remove("touch-controls-hidden");

  startGame();
});
