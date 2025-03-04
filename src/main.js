import {Ship} from "./Ship.js";
import {
    INTERVAL_BETWEEN_SHOOTING_IN_MS,
    INVADER_HEIGHT,
    INVADER_WIDTH,
    MODE,
    PROJECT_TILE_DIMENSIONS,
    PROJECT_TILE_SPEED,
    SHIP_HEIGHT,
    SHIP_WIDTH
} from "./gameConfig.js";
import {Projectile} from "./Projectile.js";
import {availableShootingModes, keyMap} from "./utils/const.js";

import {Invaders} from "./Invaders.js";
import {keyPressedMap, updateKeyState, updateShipPosition} from "./controls.js";

import {InvaderProjectTile} from "./InvaderProjectTile.js";
import {getRandomArrElement, removeProjectile} from "./helpers/helpers.js";
import ProjectTileInvaderImagePng from './assets/projecttile-invader.png'
import {drawStars, initializeStars, updateStars} from "./stars.js";
import {isProjectTileCollidingWithInvader, isProjectTileCollidingWithShip} from "./collisions.js";
import {Live} from "./Live.js";


export const isAutoShotMode = MODE === availableShootingModes.AUTO
export const isKeyPressMode = MODE === availableShootingModes.KEY_PRESS

export const canvas = document.getElementById("chicken-invaders-canvas");
export const ctx = canvas.getContext("2d");

export const canvasWidth = window.innerWidth
export const canvasHeight = window.innerHeight

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

ship.initializeShip();


const invaders = new Invaders()
invaders.initialize(
    {
        numberOfInvaders: 40, gridSize: 10
    }
)


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

const invadersProjectTile = []

const appendInvaderProjecttile = () => {
    const randomInvader = getRandomArrElement(invaders.invaders)

    const projectile = new InvaderProjectTile({
        startPosition: {
            x: randomInvader.position.x + INVADER_WIDTH / 2,
            y: randomInvader.position.y +  INVADER_HEIGHT / 2
        },
        targetPosition: {
            x: ship.position.x,
            y: ship.position.y
        },
        speed: 4,
        width: 50,
        height: 50,
        imagePng: ProjectTileInvaderImagePng
    });

    invadersProjectTile.push(projectile)
}

const invadersShootingInterval = setInterval(() => {
    appendInvaderProjecttile()
}, 1000)

//when position of project tile if offscreen then do clean up
const cleanUpProjectTile = (projectile, index) => {
    const ifOffScreen = projectile.position.x < 0 || // left boundary
        projectile.position.x > canvasWidth || // right boundary
        projectile.position.y < 0 || // top boundary
        projectile.position.y > canvasHeight // bottom boundary

    if(ifOffScreen){
        setTimeout(() => {
            removeProjectile(projectTiles, index)
        }, 0)
    }
}

//events

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

initializeStars();

const updateLives = () => {
    const lives = []

    const shipLives = ship.getShipLives()

    for(let i = 0; i < shipLives; i++){
        lives.push(new Live({
            width: 100,
            height: 100,
            position: {
                x: 50 * i + 50,
                y: 15
            }
        }))
    }

    console.log(lives)

    lives.forEach(live => {
        live.draw()
    })
}



//game looop
function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.save();

    updateLives()

    updateStars()
    drawStars();





    //ship
    ship.updateShip();
    updateShipPosition()

    invaders.update()

    invaders.invaders.forEach((invader, invaderIndex) => {
        invader.updateInvader({
            x: invaders.velocity.x,
            y: invaders.velocity.y
        });

        projectTiles.forEach((projectile, projectileIndex) => {
            if (isProjectTileCollidingWithInvader(projectile, invader)) {
                setTimeout(() => {
                    invaders.invaders.splice(invaderIndex, 1);
                    projectTiles.splice(projectileIndex, 1);
                }, 0);
            }
        });
    });
    //projectTiles
    projectTiles.forEach((projectile, index) => {
        cleanUpProjectTile(projectile, index)
        projectile.update()
    })

    invadersProjectTile.forEach((projectile, index) => {
        if (isProjectTileCollidingWithShip(projectile, ship)) {
            removeProjectile(invadersProjectTile, index)
            ship.destory()
        }

        projectile.update();
    });


    if(invaders.invaders.length <= 0){
        clearInterval(invadersShootingInterval)
    }
}


draw();






