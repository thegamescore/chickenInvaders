import {Invader} from "./Invader.js";
import {INVADER_HEIGHT, INVADER_WIDTH,  INVADERS_GAP_X, INVADERS_GAP_Y} from "./gameConfig.js";
import {canvas, canvasWidth} from "./main.js";

export class Invaders {
    constructor() {
        this.invaders = []


        this.gridWidth = 0;

        this.position ={
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 0,
            y: 0
        }

    }

    create({
                       numberOfInvaders, gridSize
                   }) {
        this.gridWidth = gridSize * INVADERS_GAP_X

        for (let i = 0; i < numberOfInvaders; i++) {
            let row = Math.floor(i / gridSize);
            let col = i % gridSize;

            const invader = new Invader({
                width: INVADER_WIDTH,
                height: INVADER_HEIGHT,
                position: {
                    x: 200 + col * INVADERS_GAP_X,
                    y: 150 + row * INVADERS_GAP_Y
                },
                velocity: {
                    x: 0,
                    y: 0
                }
            });

            this.invaders.push(invader);
        }
    }


    initialize({
                   numberOfInvaders , gridSize
               }){
        console.log(numberOfInvaders)

        this.create({
            numberOfInvaders, gridSize
        })

        this.invaders.forEach(invader => {
            invader.initializeInvader()
        })
    }

    moveInvaders(){
        this.update()

        this.invaders.forEach(invader => {
            invader.updateInvader({
                x: this.velocity.x,
                y: this.velocity.y
            })
        })
    }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(!this.velocity.x){
            this.velocity.x = 5
        }

        if(this.position.x  + 200  <= 0){
            this.velocity.x = 5
        }

        if((this.position.x + this.gridWidth + 200) > canvasWidth){
            this.velocity.x = -5
        }

    }


}


