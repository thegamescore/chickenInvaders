import {ctx} from "../canvas.js";

const SPEED = 6;
export const BOMB_EXPLOSION_RADIUS = 160;

export class BombProjectile {
  constructor({ position }) {
    this.position = { ...position };
    this.width = 32;
    this.height = 32;
    this.frame = 0;
  }

  draw() {
    this.frame += 1;
    const cx = this.position.x + this.width / 2;
    const cy = this.position.y + this.height / 2;
    const r = this.width / 2;
    const pulse = 0.7 + 0.3 * Math.sin(this.frame * 0.22);

    ctx.save();
    ctx.shadowColor = '#ff4fff';
    ctx.shadowBlur = 22 * pulse;
    ctx.fillStyle = '#cc00cc';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.font = `bold ${Math.floor(this.width * 0.55)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('★', cx, cy);
    ctx.restore();
  }

  update() {
    this.draw();
    this.position.y -= SPEED;
  }
}
