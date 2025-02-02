import ShipImagePng from "./assets/ship.png";
import {ctx, ship} from "./main.js";

export class Ship {
  constructor({ width, height, positionX, positionY }) {
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    this.rotation = 0;
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
      ctx.save()

      //*****rotation on turning left/right
      ctx.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
      ctx.rotate(this.rotation)
      ctx.translate(-this.positionX  - this.width / 2, -this.positionY - this.height / 2)
      //***

      ctx.drawImage(
          this.image,
          this.positionX,
          this.positionY,
          this.width,
          this.height,
      )

      ctx.restore()
    }
  }

  resetShip(){
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0
  }

  updateShip(){
    this.draw()
    this.positionX += this.velocity.x
    this.positionY += this.velocity.y
  }
}
