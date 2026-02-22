import { ctx } from "../canvas.js";

const EMOJI = "👾";
const INVADER_MAX_HP = 5;
const HIT_FLASH_DURATION = 10;

export class Invader {
  constructor({ width, height, position, velocity }) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.velocity = velocity;
    this.hp = INVADER_MAX_HP;
    this.hitFlash = 0;
  }

  initializeInvader() {
    this.draw();
  }

  hit() {
    this.hp--;
    this.hitFlash = HIT_FLASH_DURATION;
    return this.hp <= 0;
  }

  draw() {
    const cx = this.position.x + this.width / 2;
    const cy = this.position.y + this.height / 2;

    ctx.save();
    ctx.font = `${this.height}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    if (this.hitFlash > 0) {
      const t = this.hitFlash / HIT_FLASH_DURATION;

      // Horizontal shake
      const shakeX = Math.sin(this.hitFlash * 4.2) * 7 * t;

      // Scale up on impact, shrinks back as flash fades
      const scale = 1 + t * 0.28;
      ctx.translate(cx + shakeX, cy);
      ctx.scale(scale, scale);
      ctx.translate(-cx, -cy);

      // Red glow around the emoji
      ctx.shadowColor = `rgba(255, 20, 20, ${t})`;
      ctx.shadowBlur = 28 * t;

      this.hitFlash--;
    }

    ctx.fillText(EMOJI, cx, this.position.y);
    ctx.restore();
  }

  updateInvader(velocity) {
    this.draw();
    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }
}
