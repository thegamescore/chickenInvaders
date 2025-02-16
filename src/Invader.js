import InvaderPng from "./assets/invader.png";
import {ctx} from "./main.js";

export class Invader {
    /**
     * Creates an instance of Projectile.
     * @param {{ x: number, y: number }} position - The position of the projectile.
     * @param {{ x: number, y: number }} velocity - The velocity of the projectile.
     * @param {number} width - The width of the projectile.
     * @param {number} height - The height of the projectile.
     */
    constructor({ width, height, position, velocity }) {
        this.width = width;
        this.height = height;
        this.position = position
        
        this.velocity = velocity
        this.image = new Image();

        this.addImageUrl(InvaderPng);
    }

    addImageUrl(imageUrl) {
        if (this.image) {

            this.image.src = imageUrl;
        }
    }

    initializeInvader() {
        this.image.onload = () => {
            this.draw()
        };
    }

    draw(){
        if (this.image) {
            ctx.save()

            ctx.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height,
            )

            ctx.restore()
        }
    }

    // resetInvader(){
    //     this.velocity = {
    //         x: 0,
    //         y: 0
    //     }
    // }

    updateInvader(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
