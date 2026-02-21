import { Invader } from "./Invader.js";
import {
  INVADER_HEIGHT,
  INVADER_WIDTH,
  INVADERS_GAP_X,
  INVADERS_GAP_Y,
  INVADERS_VELOCITY,
} from "../utils/gameConfig.js";

import { canvasWidth } from "../canvas.js";

const COMPACT_SPEED = 0.03;

export class Invaders {
  constructor() {
    this.invaders = [];

    this.groupOffsetX = 0;

    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  reset() {
    this.invaders = [];

    this.groupOffsetX = 0;

    this.velocity = { x: 0, y: 0 };
  }

  create({ numberOfInvaders, gridSize }) {
    this.groupOffsetX = 200;

    for (let i = 0; i < numberOfInvaders; i++) {
      let row = Math.floor(i / gridSize);
      let col = i % gridSize;

      const localX = col * INVADERS_GAP_X;

      const invader = new Invader({
        width: INVADER_WIDTH,
        height: INVADER_HEIGHT,
        position: {
          x: this.groupOffsetX + localX,
          y: 150 + row * INVADERS_GAP_Y,
        },
        velocity: {
          x: 0,
          y: 0,
        },
      });

      invader.row = row;
      invader.col = col;
      invader.localX = localX;
      invader.targetLocalX = localX;

      this.invaders.push(invader);
    }
  }

  // After a kill, recalculate target positions so surviving invaders
  // in each row slide together to fill the gap.
  recompactRows() {
    const rowMap = new Map();
    this.invaders.forEach((inv) => {
      if (!rowMap.has(inv.row)) rowMap.set(inv.row, []);
      rowMap.get(inv.row).push(inv);
    });

    rowMap.forEach((rowInvaders) => {
      rowInvaders.sort((a, b) => a.col - b.col);
      rowInvaders.forEach((inv, i) => {
        inv.targetLocalX = i * INVADERS_GAP_X;
      });
    });
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

    // Wall bounce based on actual current positions
    const leftLocal = Math.min(...this.invaders.map((inv) => inv.localX));
    const rightLocal = Math.max(...this.invaders.map((inv) => inv.localX + inv.width));

    const projectedLeft = this.groupOffsetX + leftLocal + this.velocity.x;
    const projectedRight = this.groupOffsetX + rightLocal + this.velocity.x;

    if (projectedLeft <= 0) {
      this.velocity.x = INVADERS_VELOCITY;
    } else if (projectedRight >= canvasWidth) {
      this.velocity.x = -INVADERS_VELOCITY;
    }

    this.groupOffsetX += this.velocity.x;

    // Slide each invader toward its compact target while moving with the group
    this.invaders.forEach((inv) => {
      inv.localX += (inv.targetLocalX - inv.localX) * COMPACT_SPEED;
      inv.position.x = this.groupOffsetX + inv.localX;
    });
  }
}
