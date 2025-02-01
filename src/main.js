import { Ship } from "./Ship.js";
import { SHIP_HEIGHT, SHIP_WIDTH } from "./gameConfig.js";

export const canvas = document.getElementById("chicken-invaders-canvas");
export const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// const ship = new Ship({
//     width: SHIP_WIDTH,
//     height: SHIP_HEIGHT,
//     positionX: canvas.width / 2,
//     positionY: canvas.height - 75
// })
