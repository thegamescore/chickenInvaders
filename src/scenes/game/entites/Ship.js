import ShipImagePng from "../../../assets/ship.png";
import { canvas, ctx } from "../canvas.js";

export class Ship {
  /**
   * Creates an instance of Projectile.
   * @param {{ x: number, y: number }} position - The position of the projectile.
   * @param {{ x: number, y: number }} velocity - The velocity of the projectile.
   * @param {number} width - The width of the projectile.
   * @param {number} height - The height of the projectile.
   */
  constructor({ width, height, position, velocity, numberOfLives }) {
    this._initialState = structuredClone({ width, height, position, velocity, numberOfLives });

    this._applyState(this._initialState);

    this.isFlashing = false;
    this.rotation = 0;
    this.image = new Image();
    this.addImageUrl(ShipImagePng);
  }


  _applyState({ width, height, position, velocity, numberOfLives }) {
    this.width = width;
    this.height = height;
    this.position = { ...position };
    this.velocity = { ...velocity };
    this.lives = numberOfLives;
  }

  reset() {
    this._applyState(this._initialState);
    this.isFlashing = false;
    this.rotation = 0;
  }

  getShipLives() {
    return this.lives;
  }

  addImageUrl(imageUrl) {
    if (this.image) {
      this.image.src = imageUrl;
    }
  }

  initializeShip() {
    this.image.onload = () => {
      this.draw();
    };
  }

  destroy() {
    this.lives = this.lives - 1;

    this.startFlashing();
  }

  startFlashing() {
    let flashCount = 0;
    const flashInterval = setInterval(() => {
      this.isFlashing = !this.isFlashing;
      flashCount++;

      if (flashCount > 5) {
        clearInterval(flashInterval);
        this.isFlashing = false;
      }
    }, 100);
  }

  draw() {
    if (this.image) {
      ctx.save();

      //*****rotation on turning left/right
      ctx.translate(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2,
      );
      ctx.rotate(this.rotation);
      ctx.translate(
        -this.position.x - this.width / 2,
        -this.position.y - this.height / 2,
      );
      //***

      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
      );

      if (this.isFlashing) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Red overlay with transparency
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
      }

      ctx.restore();
    }
  }

  resetShip() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;
  }

  resetShipPosition() {
    this.position = { x: canvas.width / 2, y: canvas.height - 150 };
  }




  updateShip() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
