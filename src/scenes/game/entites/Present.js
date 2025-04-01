import {ctx} from "../canvas.js";


export class Present {
    constructor({ width, height, position, velocity, image }) {
        this.width = width;
        this.height = height;
        this.position = position;

        this.velocity = velocity;
        this.image = null

        this.addImageUrl(image);
    }

    addImageUrl(image) {
        this.image = image;
    }

    draw() {
        if (this.image) {
            ctx.save();

            const { x, y } = this.position;

            // Slight glowing aura around the present
            ctx.shadowColor = 'rgba(255, 255, 0, 0.6)';
            ctx.shadowBlur = 12;
            ctx.drawImage(this.image, x, y, this.width, this.height);
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.rect(x, y, this.width, this.height);
            ctx.clip();

            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            for (let lineY = y; lineY < y + this.height; lineY += 2) {
                ctx.fillRect(x, lineY, this.width, 1);
            }

            ctx.restore();
        }
    }

    updatePresent(velocity) {
        this.draw();
        this.position.x += velocity.x;
        this.position.y += velocity.y;
    }
}
