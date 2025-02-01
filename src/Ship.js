import ShipImagePng from "./assets/ship.png";
import { ctx } from "./main.js";

export class Ship {
  constructor({ width, height, positionX, positionY }) {
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocity = {
      x: 0,
      y: 0
    }
    this.image = new Image();

    this.addImageUrl(ShipImagePng);
  }

  addImageUrl(imageUrl) {
    if (this.image) {
      this.image.src = imageUrl;
    }
  }

  initalizeShip() {
    this.image.onload = () => {
      this. draw()
    };
  }

  draw(){
    if (this.image) {
      ctx.drawImage(
          this.image,
          this.positionX,
          this.positionY,
          this.width,
          this.height,
      );
    }
  }

  resetVelocity(){
    this.velocity = {
      x: 0,
      y: 0
    }
  }

  updateShip(){
    this.draw()
    this.positionX += this.velocity.x
    this.positionY += this.velocity.y
  }
}
