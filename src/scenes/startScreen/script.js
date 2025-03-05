const startButton = document.getElementById("start-button")
const chickenInvadersCanvas = document.getElementById("chicken-invaders-canvas")
const startScreenWrapper = document.getElementById("start-screen")

window.addEventListener("load", (event) => {
    startButton.focus()
});

startButton.addEventListener('click', () => {
    chickenInvadersCanvas.classList.add("chicken-invaders-visible")
    startScreenWrapper.classList.add("start-screen-hidden")
})