import { levelTransitionEventName } from "../../events.js";

const eventTransitionWrapper = document.getElementById("level-transition-text");
const levelTranstionCounter = document.getElementById(
  "level-transition-counter",
);

window.addEventListener(levelTransitionEventName, (event) => {
  console.log(event);

  levelTranstionCounter.innerText = event.detail.currentLevel;

  eventTransitionWrapper.classList.add("level-transition-visible");

  setTimeout(() => {
    eventTransitionWrapper.classList.remove("level-transition-visible");
  }, 1500);
});
