import { Ship } from "./Ship.js";
import {ROTATION_ANGLE, SHIP_HEIGHT, SHIP_VELOCITY, SHIP_WIDTH} from "./gameConfig.js";

export const canvas = document.getElementById("chicken-invaders-canvas");
export const ctx = canvas.getContext("2d");

const canvasWidth = window.innerWidth
const canvasHeight = window.innerHeight

canvas.width = canvasWidth;
canvas.height = canvasHeight;

export const ship = new Ship({
    width: SHIP_WIDTH,
    height: SHIP_HEIGHT,
    positionX: canvas.width / 2,
    positionY: canvas.height - 150
})

ship.initalizeShip();

const keyMap = {
    TURN_LEFT: 'ArrowLeft',
    TURN_RIGHT: 'ArrowRight',
    TURN_DOWN: 'ArrowDown',
    TURN_UP: 'ArrowUp'
};

/** @type {Record<string, boolean>} */
const keyPressedMap = Object.fromEntries(
    Object.keys(keyMap).map(key => [key, false])
);

const updateKeyState = (event, isPressed) => {
    for (const [action, key] of Object.entries(keyMap)) {
        if (event.key === key) {
            keyPressedMap[action] = isPressed;
        }
    }
};

function  updateShipPosition(){
    if(keyPressedMap["TURN_LEFT"]){
        ship.velocity.x = -SHIP_VELOCITY
        ship.rotation = -ROTATION_ANGLE
        return
    }

    if(keyPressedMap["TURN_RIGHT"]){
        ship.velocity.x = SHIP_VELOCITY
        ship.rotation = ROTATION_ANGLE
        return
    }

    ship.resetShip()
}



window.addEventListener('keydown', event => updateKeyState(event, true));
window.addEventListener('keyup', event => updateKeyState(event, false));

function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ship.updateShip();
    updateShipPosition()
    console.log(keyPressedMap)
}

draw();






