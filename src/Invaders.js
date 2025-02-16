import {Invader} from "./Invader.js";
import { INVADER_HEIGHT, INVADER_WIDTH, INVADERS_GAP} from "./gameConfig.js";
import {canvas} from "./main.js";


export class Invaders {
    constructor() {
        this.invaders = []

        this.create()

    }

    create(numberOfInvaders = 20) {
        let gridSize = 10;


        for (let i = 0; i < numberOfInvaders; i++) {
            let row = Math.floor(i / gridSize);
            let col = i % gridSize;

            const invader = new Invader({
                width: INVADER_WIDTH,
                height: INVADER_HEIGHT,
                position: {
                    x: 200 + col * INVADERS_GAP,
                    y: 150 + row * 150
                },
                velocity: {
                    x: 0,
                    y: 0
                }
            });

            this.invaders.push(invader);
        }
    }


    initialize(){
        this.invaders.forEach(invader => {
            invader.initializeInvader()
        })
    }

    updateInvaders(){
        this.invaders.forEach(invader => {
            invader.updateInvader()
        })
    }
}


