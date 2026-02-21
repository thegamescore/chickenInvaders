import { ctx } from "../canvas.js";

const EMOJI = "👾";

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
    this.position = position;
    this.velocity = velocity;
  }

  initializeInvader() {
    this.draw();
  }

  draw() {
    ctx.save();
    ctx.font = `${this.height}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(
      EMOJI,
      this.position.x + this.width / 2,
      this.position.y,
    );
    ctx.restore();
  }

  updateInvader(velocity) {
    this.draw();
    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }
}
