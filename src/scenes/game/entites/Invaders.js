import { Invader } from "./Invader.js";
import {
  INVADER_HEIGHT,
  INVADER_WIDTH,
  INVADERS_GAP_X,
  INVADERS_GAP_Y,
  INVADERS_VELOCITY,
} from "../utils/gameConfig.js";

import { canvasWidth } from "../canvas.js";

export class Invaders {
  constructor() {
    this.invaders = [];

    this.gridWidth = 0;

    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  reset() {
    this.invaders = [];

    this.gridWidth = 0;

    this.position = { x: 0, y: 0 };

    this.velocity = { x: 0, y: 0 };
  }

  create({ numberOfInvaders, gridSize }) {
    this.gridWidth = gridSize * INVADERS_GAP_X;

    for (let i = 0; i < numberOfInvaders; i++) {
      let row = Math.floor(i / gridSize);
      let col = i % gridSize;

      const invader = new Invader({
        width: INVADER_WIDTH,
        height: INVADER_HEIGHT,
        position: {
          x: 200 + col * INVADERS_GAP_X,
          y: 150 + row * INVADERS_GAP_Y,
        },
        velocity: {
          x: 0,
          y: 0,
        },
      });

      this.invaders.push(invader);
    }
  }

  initialize({ numberOfInvaders, gridSize }) {
    this.reset();

    this.create({
      numberOfInvaders,
      gridSize,
    });

    this.invaders.forEach((invader) => {
      invader.initializeInvader();
    });
  }

  update() {
    if (!this.velocity.x) {
      this.velocity.x = INVADERS_VELOCITY;
    }

    if (this.invaders.length === 0) return;

    const leftEdge = Math.min(...this.invaders.map((inv) => inv.position.x));
    const rightEdge = Math.max(...this.invaders.map((inv) => inv.position.x + inv.width));

    if (leftEdge + this.velocity.x <= 0) {
      this.velocity.x = INVADERS_VELOCITY;
    } else if (rightEdge + this.velocity.x >= canvasWidth) {
      this.velocity.x = -INVADERS_VELOCITY;
    }
  }
}
