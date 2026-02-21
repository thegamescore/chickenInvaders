import { setKeyState } from "./controls.js";

const touchLeftBtn = document.getElementById("touch-left");
const touchRightBtn = document.getElementById("touch-right");

const addTouchControl = (button, action) => {
  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    setKeyState(action, true);
  }, { passive: false });

  button.addEventListener("touchend", (e) => {
    e.preventDefault();
    setKeyState(action, false);
  }, { passive: false });

  button.addEventListener("touchcancel", () => {
    setKeyState(action, false);
  });
};

addTouchControl(touchLeftBtn, "TURN_LEFT");
addTouchControl(touchRightBtn, "TURN_RIGHT");

// Prevent canvas scroll/zoom on touch
const gameCanvas = document.getElementById("chicken-invaders-canvas");
gameCanvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
gameCanvas.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
