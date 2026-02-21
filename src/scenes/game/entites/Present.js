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
        if (!this.image) return;

        if (this.frame === undefined) {
            this.frame = Math.floor(Math.random() * 48);
        }
        this.frame += 1;

        const { x, y } = this.position;
        const w = this.width;
        const h = this.height;
        const p = 8; // chamfer size — defines the octagon cut

        // PICO-8 palette cycling (changes every 28 frames — slower, less frantic)
        const palette = ['#ff004d', '#ffa300', '#ffec27', '#00e436', '#29adff', '#83769c', '#ff77a8', '#00b8d4'];
        const color = palette[Math.floor(this.frame / 28) % palette.length];

        // Gentle bob (visual only — doesn't affect collision position)
        const bobY = Math.sin(this.frame * 0.08) * 4;
        // Gentle tilt
        const tilt = Math.sin(this.frame * 0.04) * 0.08;

        const cx = x + w / 2;
        const cy = y + h / 2;

        const octagon = (ox, oy) => {
            ctx.beginPath();
            ctx.moveTo(ox + p,     oy);
            ctx.lineTo(ox + w - p, oy);
            ctx.lineTo(ox + w,     oy + p);
            ctx.lineTo(ox + w,     oy + h - p);
            ctx.lineTo(ox + w - p, oy + h);
            ctx.lineTo(ox + p,     oy + h);
            ctx.lineTo(ox,         oy + h - p);
            ctx.lineTo(ox,         oy + p);
            ctx.closePath();
        };

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // Apply bob + tilt around the present's center
        ctx.translate(cx, cy + bobY);
        ctx.rotate(tilt);
        ctx.translate(-cx, -cy);

        // Hard pixel drop shadow (no glow)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        octagon(x + 4, y + 4);
        ctx.fill();

        // Cycling color frame with matching glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
        ctx.fillStyle = color;
        octagon(x, y);
        ctx.fill();

        // Clear glow before clipping and drawing image
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Clip to octagon, then draw image inset inside
        octagon(x, y);
        ctx.clip();

        const inset = 5;
        ctx.drawImage(this.image, x + inset, y + inset, w - inset * 2, h - inset * 2);

        // Classic sprite shine — top-left highlight
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + p,     y + 2,     Math.floor(w * 0.35), 2);
        ctx.fillRect(x + 2,     y + p,     2, Math.floor(h * 0.2));

        ctx.restore();
    }

    updatePresent(velocity) {
        this.draw();
        this.position.x += velocity.x;
        this.position.y += velocity.y;
    }
}
