import { ctx } from "../canvas.js";

export class BossBomb {
  constructor({ x, y, velocityX = 0, velocityY = 5, canvasHeight }) {
    this.position = { x: x - 16, y };
    this.width = 32;
    this.height = 32;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.canvasHeight = canvasHeight;
    this.frame = 0;
  }

  isOffScreen() {
    return this.position.y > this.canvasHeight + this.height;
  }

  draw() {
    const cx = this.position.x + this.width / 2;
    const cy = this.position.y + this.height / 2;
    const pulse = 0.7 + 0.3 * Math.sin(this.frame * 0.18);

    ctx.save();
    ctx.shadowColor = '#ff4400';
    ctx.shadowBlur = 18 * pulse;
    ctx.font = `${this.width}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💣', cx, cy);
    ctx.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocityX;
    this.position.y += this.velocityY;
    this.frame++;
  }
}
