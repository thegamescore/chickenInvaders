import {ctx, ship} from "./main.js";
import ProjectileImagePng from "./assets/projectile.png";
import {PROJECT_TILE_DIMENSIONS, PROJECT_TILE_SPEED} from "./gameConfig.js";

export class Projectile {
    constructor({
                    position,
                    velocity
                }) {
        this.position = position;
        this.image = new Image();
        this.velocity = {
            x: 0,
            y: PROJECT_TILE_SPEED
        };
        this.width = PROJECT_TILE_DIMENSIONS.width;
        this.height = PROJECT_TILE_DIMENSIONS.height

        this.addImageUrl(ProjectileImagePng)
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

    update(){
        this.draw()

        this.position.y -= this.velocity.y
    }


}
