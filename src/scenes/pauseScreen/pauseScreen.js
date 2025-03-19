import {pauseGameEventName, unPauseGame} from "../../events.js";

const pauseScreenWrapper = document.getElementById("pause-screen");
const unpauseButton = document.getElementById("unpause-button")




window.addEventListener(pauseGameEventName, () => {
    pauseScreenWrapper.classList.remove("pause-screen-hidden")
});

unpauseButton.addEventListener("click", () => {
    pauseScreenWrapper.classList.add("pause-screen-hidden")
    unPauseGame()
})