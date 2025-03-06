import {ctx} from "../canvas.js";


export class InvaderProjectTile {
    /**
     * Creates an instance of Projectile.
     * @param {{ x: number, y: number }} startPosition - The position of the invader (where the projectile starts).
     * @param {{ x: number, y: number }} targetPosition - The position of the ship (target).
     * @param {number} speed - The speed of the projectile.
     * @param {number} width - The width of the projectile.
     * @param {number} height - The height of the projectile.
     */
    constructor({ startPosition, targetPosition, speed, width, height, imagePng }) {
        this.position = { ...startPosition };
        this.image = new Image();
        this.width = width;
        this.height = height;

        // Calculate angle between invader and ship
        const angle = Math.atan2(
            targetPosition.y - startPosition.y,
            targetPosition.x - startPosition.x
        );

        // Calculate velocity based on angle and speed
        this.velocity = {
            x: speed * Math.cos(angle),
            y: speed * Math.sin(angle),
        };

        this.addImageUrl(imagePng);
    }

    addImageUrl(imageUrl) {
        if (this.image) {
            this.image.src = imageUrl;
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.drawImage(
            this.image,
            this.position.x - this.width / 2,
            this.position.y - this.height / 2,
            this.width,
            this.height
        );
        ctx.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}