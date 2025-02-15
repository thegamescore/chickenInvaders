import { Ship } from "./Ship.js";
import {
    INTERVAL_BETWEEN_SHOOTING_IN_MS, INVADER_HEIGHT, INVADER_WIDTH, MODE,
    PROJECT_TILE_DIMENSIONS,
    PROJECT_TILE_SPEED,
    ROTATION_ANGLE,
    SHIP_HEIGHT,
    SHIP_VELOCITY,
    SHIP_WIDTH
} from "./gameConfig.js";
import {Projectile} from "./Projectile.js";
import {availableShootingModes,  keyMap} from "./const.js";
import {Invader} from "./Invader.js";

export const isAutoShotMode = MODE === availableShootingModes.AUTO
export const isKeyPressMode = MODE === availableShootingModes.KEY_PRESS

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
    position: {
        x: canvas.width / 2,
        y: canvas.height - 150
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const invader = new Invader({
    width:  INVADER_WIDTH,
    height: INVADER_HEIGHT,
    position: {
        x: (canvas.width - INVADER_WIDTH) / 2,
        y: canvas.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

ship.initializeShip();
invader.initializeInvader()


// PROJECT TILES -----------------

const projectTiles = []


const appendProjectTile = () => {
    const projectile = new Projectile({
        position: {
            x: ship.position.x + ship.width / 2,
            y: ship.position.y
        },
        velocity: {
            x: 0,
            y: PROJECT_TILE_SPEED
        },
        width: PROJECT_TILE_DIMENSIONS.width,
        height: PROJECT_TILE_DIMENSIONS.height
    })

    projectTiles.push(projectile)
}


if(isAutoShotMode){
    //automatic shot after
    setInterval(() => {
        appendProjectTile()
    }, INTERVAL_BETWEEN_SHOOTING_IN_MS)
}


// -----------------

/** @type {Record<string, boolean>} */
const keyPressedMap = Object.fromEntries(
    Object.keys(keyMap).map(key => [key, false])
);

const updateKeyState = (event, isPressed) => {
    for (const [action, key] of Object.entries(keyMap)) {
        if (event.code === key) {
            keyPressedMap[action] = isPressed;
        }
    }
};

function  updateShipPosition(){
    if(keyPressedMap["TURN_LEFT"]){
        //prevent ship from overlapping map
        if(ship.position.x <= 0){
            ship.resetShip()
            return
        }

        ship.velocity.x = -SHIP_VELOCITY
        ship.rotation = -ROTATION_ANGLE
        return
    }

    if(keyPressedMap["TURN_RIGHT"]){
        //prevent ship from overlapping map
        if(ship.position.x >= canvasWidth - SHIP_WIDTH){
            ship.resetShip()
            return
        }

        ship.velocity.x = SHIP_VELOCITY
        ship.rotation = ROTATION_ANGLE
        return
    }

    ship.resetShip()
}

window.addEventListener('keydown', event => {
    if(isKeyPressMode && event.code === keyMap.SHOT && !keyPressedMap["SHOT"]){
        setTimeout(() => {
            appendProjectTile()
        }, 0)
    }

    // updateKeyState is placed at the end to ensure that any key-hold prevention logic
    updateKeyState(event, true);
});


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
    invader.updateInvader()
    updateShipPosition()

    //projectTiles
    projectTiles.forEach((projectile, index) => {
        cleanUpProjectTile(projectile, index)
        projectile.update()
    })
}


draw();






