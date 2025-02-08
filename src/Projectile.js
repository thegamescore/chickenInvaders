import {ctx, ship} from "./main.js";

export class Projectile {
    constructor({
                    position,
                    velocity
                }) {
        this.position = position;

        this.velocity = {
            x: 0,
            y: 5
        };
    }

    draw(){
        ctx.save()

        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();



        ctx.restore()
    }

    update(){
        this.draw()

        this.position.y -= this.velocity.y
    }


}
