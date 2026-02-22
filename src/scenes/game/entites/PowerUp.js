import {ctx} from "../canvas.js";

const POWER_UP_CONFIGS = {
  RAPID_FIRE:  { color: '#ffaa00', symbol: '⚡' },
  SPREAD_SHOT: { color: '#8ffaff', symbol: '»' },
  BOMB:        { color: '#ff4fff', symbol: '★' },
};

export class PowerUp {
  constructor({ type, position, width, height }) {
    this.type = type;
    this.position = position;
    this.width = width;
    this.height = height;
    this.frame = 0;
  }

  draw() {
    this.frame += 1;
    const { x, y } = this.position;
    const w = this.width;
    const h = this.height;
    const p = 8;
    const config = POWER_UP_CONFIGS[this.type] ?? POWER_UP_CONFIGS.RAPID_FIRE;
    const { color, symbol } = config;

    const pulse = 0.7 + 0.3 * Math.sin(this.frame * 0.12);
    const bobY = Math.sin(this.frame * 0.08) * 4;
    const cx = x + w / 2;
    const cy = y + h / 2;

    const octagon = (ox, oy) => {
      ctx.beginPath();
      ctx.moveTo(ox + p,     oy);
      ctx.lineTo(ox + w - p, oy);
      ctx.lineTo(ox + w,     oy + p);
      ctx.lineTo(ox + w,     oy + h - p);
      ctx.lineTo(ox + w - p, oy + h);
      ctx.lineTo(ox + p,     oy + h);
      ctx.lineTo(ox,         oy + h - p);
      ctx.lineTo(ox,         oy + p);
      ctx.closePath();
    };

    ctx.save();
    ctx.translate(cx, cy + bobY);
    ctx.translate(-cx, -cy);

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    octagon(x + 4, y + 4);
    ctx.fill();

    // Glowing fill
    ctx.shadowColor = color;
    ctx.shadowBlur = 18 * pulse;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    octagon(x, y);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // Symbol text
    ctx.font = `bold ${Math.floor(w * 0.45)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(symbol, cx, cy);

    ctx.restore();
  }

  updatePowerUp(velocity) {
    this.draw();
    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }
}
