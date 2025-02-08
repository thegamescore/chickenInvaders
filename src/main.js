import { Ship } from "./Ship.js";
import {ROTATION_ANGLE, SHIP_HEIGHT, SHIP_VELOCITY, SHIP_WIDTH} from "./gameConfig.js";
import {Projectile} from "./Projectile.js";

export const canvas = document.getElementById("chicken-invaders-canvas");
export const ctx = canvas.getContext("2d");

const canvasWidth = window.innerWidth
const canvasHeight = window.innerHeight

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// SHIP -----------------

export const ship = new Ship({
    width: SHIP_WIDTH,
    height: SHIP_HEIGHT,
    positionX: canvas.width / 2,
    positionY: canvas.height - 150
})

ship.initalizeShip();

// PROJECT TILES -----------------

const projectTiles = []

setInterval(() => {
    const projectile = new Projectile({
        position: {
            x: ship.positionX + ship.width / 2,
            y: ship.positionY
        }
    })

    projectTiles.push(projectile)
},200)

// -----------------

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
        //prevent ship from overlapping map
        if(ship.positionX <= 0){
            ship.resetShip()
            return
        }

        ship.velocity.x = -SHIP_VELOCITY
        ship.rotation = -ROTATION_ANGLE
        return
    }

    if(keyPressedMap["TURN_RIGHT"]){
        //prevent ship from overlapping map
        if(ship.positionX >= canvasWidth - SHIP_WIDTH){
            ship.resetShip()
            return
        }

        ship.velocity.x = SHIP_VELOCITY
        ship.rotation = ROTATION_ANGLE
        return
    }

    ship.resetShip()
}

window.addEventListener('keydown', event => updateKeyState(event, true));
window.addEventListener('keyup', event => updateKeyState(event, false));

//when position of project tile if offscreen then do clean up
const cleanUpProjectTile = (projectile, index) => {
    const ifOffScreen = projectile.position.x < 0 || // left boundary
        projectile.position.x > canvasWidth || // right boundary
        projectile.position.y < 0 || // top boundary
        projectile.position.y > canvasHeight // bottom boundary

    if(ifOffScreen){
        setTimeout(() => {
            projectTiles.splice(index, 1)
        }, 0)
    }
}

function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    //ship
    ship.updateShip();
    updateShipPosition()

    //projectTiles
    projectTiles.forEach((projectile, index) => {
        cleanUpProjectTile(projectile, index)
        projectile.update()
    })

}


draw();






