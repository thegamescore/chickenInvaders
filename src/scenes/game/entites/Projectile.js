import ProjectileImagePng from "../../../assets/projectile-ship.svg";
import { ctx } from "../canvas.js";

export class Projectile {
  /**
   * Creates an instance of Projectile.
   * @param {{ x: number, y: number }} position - The position of the projectile.
   * @param {{ x: number, y: number }} velocity - The velocity of the projectile.
   * @param {number} width - The width of the projectile.
   * @param {number} height - The height of the projectile.
   */
  constructor({ position, velocity, width, height }) {
    this.position = position;
    this.image = new Image();
    this.velocity = velocity;
    this.width = width;
    this.height = height;

    this.addImageUrl(ProjectileImagePng);
  }

  addImageUrl(imageUrl) {
    if (this.image) {
      this.image.src = imageUrl;
    }
  }

  draw() {
    ctx.save();

    ctx.shadowColor = "rgba(0, 200, 255, 0.9)";
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.drawImage(
      this.image,
      this.position.x - this.width / 2,
      this.position.y,
      this.width,
      this.height,
    );

    ctx.restore();
  }

  update() {
    this.draw();

    this.position.y -= this.velocity.y;
  }
}
