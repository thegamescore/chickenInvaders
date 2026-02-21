import ShipImagePng from "../../../assets/ship.png";
import { canvas, ctx } from "../canvas.js";
import { playDeathSound } from "../audio.js";
import { SHIP_START_BOTTOM_OFFSET } from "../utils/gameConfig.js";

const HIT_ANIMATION_DURATION_FRAMES = 26;
const HIT_SHAKE_PIXELS = 10;
const HIT_WOBBLE_RADIANS = 0.28;
const HIT_SCALE_BOOST = 0.18;

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
    this.isInvulnerable = false;
    this.hitAnimationFrames = 0;
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
    this.isInvulnerable = false;
    this.hitAnimationFrames = 0;
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
    if (this.isInvulnerable || this.lives <= 0) {
      return false;
    }

    this.isInvulnerable = true;
    this.lives = this.lives - 1;
    this.hitAnimationFrames = HIT_ANIMATION_DURATION_FRAMES;
    playDeathSound();

    this.startFlashing();

    setTimeout(() => {
      this.isInvulnerable = false;
    }, 600);

    return true;
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

      const hasHitAnimation = this.hitAnimationFrames > 0;
      const hitProgress = hasHitAnimation
        ? 1 - this.hitAnimationFrames / HIT_ANIMATION_DURATION_FRAMES
        : 1;
      const hitDecay = 1 - hitProgress;
      const shakeX = hasHitAnimation
        ? Math.sin(hitProgress * Math.PI * 10) * HIT_SHAKE_PIXELS * hitDecay
        : 0;
      const shakeY = hasHitAnimation
        ? Math.cos(hitProgress * Math.PI * 14) * HIT_SHAKE_PIXELS * 0.35 * hitDecay
        : 0;
      const hitRotation = hasHitAnimation
        ? Math.sin(hitProgress * Math.PI * 8) * HIT_WOBBLE_RADIANS * hitDecay
        : 0;
      const hitScale = hasHitAnimation
        ? 1 + Math.sin(hitProgress * Math.PI) * HIT_SCALE_BOOST
        : 1;

      ctx.translate(
        this.position.x + this.width / 2 + shakeX,
        this.position.y + this.height / 2 + shakeY,
      );
      ctx.rotate(this.rotation + hitRotation);
      ctx.scale(hitScale, hitScale);
      ctx.translate(-this.width / 2, -this.height / 2);

      ctx.drawImage(
        this.image,
        0,
        0,
        this.width,
        this.height,
      );

      if (hasHitAnimation) {
        ctx.save();
        ctx.globalAlpha = hitDecay * 0.6;
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          this.width / 2,
          this.height / 2,
          this.width * 0.45 + hitProgress * 32,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();
      }

      if (this.isFlashing || hasHitAnimation) {
        const hitGlow = hasHitAnimation
          ? 0.2 + Math.sin(hitProgress * Math.PI * 9) * 0.18
          : 0;
        const alpha = Math.max(0.2, Math.min(0.6, (this.isFlashing ? 0.45 : 0) + hitGlow));
        ctx.fillStyle = `rgba(255, 60, 25, ${alpha})`;
        ctx.fillRect(0, 0, this.width, this.height);
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
    this.position = { x: canvas.width / 2, y: canvas.height - SHIP_START_BOTTOM_OFFSET };
  }




  updateShip() {
    this.draw();
    if (this.hitAnimationFrames > 0) {
      this.hitAnimationFrames -= 1;
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
