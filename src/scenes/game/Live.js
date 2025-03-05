import {ctx} from "./main.js";
import HeartImagePng from "../../assets/heart.png";

export class Live {
    /**
     * Creates an instance of Projectile.
     * @param {{ x: number, y: number }} position - The position of the projectile.
     * @param {number} width - The width of the projectile.
     * @param {number} height - The height of the projectile.
     */
    constructor({
                    position,
                    width,
                    height
                }) {
        this.position = position;
        this.image = new Image();
        this.width = width;
        this.height = height

        this.addImageUrl(HeartImagePng)
    }

    addImageUrl(imageUrl) {
        if (this.image) {
            this.image.src = imageUrl;
        }
    }

    draw(){
        ctx.save()

        ctx.beginPath();

        ctx.drawImage(
            this.image,
            this.position.x - this.width / 2,
            this.position.y,
            this.width,
            this.height
        )

        ctx.restore()
    }
}
