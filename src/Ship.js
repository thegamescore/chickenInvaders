import  ShipImagePng  from './assets/ship.png'
import {ctx} from "./main.js";

export class Ship {
    constructor({
                    width, height, positionX, positionY
                }) {
        this.width = width;
        this.height = height
        this.positionX = positionX;
        this.positionY = positionY;
        this.image = new Image()

        this.addImageUrl(ShipImagePng)
        this.drawImage(this.positionX, this.positionY)
    }

    addImageUrl(imageUrl){
        if(this.image){
            this.image.src = imageUrl
        }
    }

    drawImage(positionX, positionY){
        if(this.image) {
            this.image.onload = () => {
                ctx.drawImage(this.image, positionX, positionY, this.width, this.height)
            }
        }
    }

}