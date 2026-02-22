import { ctx } from "../canvas.js";

const BOSS_MAX_HP      = 150;
const SPEED_NORMAL     = 2;
const SPEED_ENRAGED    = 3.5;
const HIT_FLASH_DUR    = 10;

export class Boss {
  constructor({ canvasWidth, canvasHeight }) {
    this.canvasWidth     = canvasWidth;
    this.canvasHeight    = canvasHeight;
    this.maxHp           = BOSS_MAX_HP;
    this.hp              = BOSS_MAX_HP;
    this.width           = 200;
    this.height          = 160;
    this.position        = { x: canvasWidth / 2 - 100, y: 50 };
    this.velocityX       = SPEED_NORMAL;
    this.hitFlashFrames  = 0;
    this.frame           = 0;
    this.lastShotTime    = 0;
    this._enrageDone     = false;
    this._justEnraged    = false;
  }

  get isEnraged() { return this.hp > 0 && this.hp <= this.maxHp / 2; }
  get isDead()    { return this.hp <= 0; }

  hit(damage = 1) {
    this.hp = Math.max(0, this.hp - damage);
    this.hitFlashFrames = HIT_FLASH_DUR;
    if (this.isEnraged && !this._enrageDone) {
      this._enrageDone  = true;
      this._justEnraged = true;
    }
    return this.isDead;
  }

  consumeEnrageEvent() {
    if (this._justEnraged) { this._justEnraged = false; return true; }
    return false;
  }

  update() {
    const speed = this.isEnraged ? SPEED_ENRAGED : SPEED_NORMAL;
    if (Math.abs(this.velocityX) !== speed) {
      this.velocityX = this.velocityX > 0 ? speed : -speed;
    }
    this.position.x += this.velocityX;
    if (this.position.x + this.width >= this.canvasWidth || this.position.x <= 0) {
      this.velocityX *= -1;
    }
    if (this.hitFlashFrames > 0) this.hitFlashFrames--;
    this.frame++;
  }

  // Boss manages its own shooting cadence; returns array of bomb params or null
  getNewBombs() {
    const now      = performance.now();
    const interval = this.isEnraged ? 800 : 1500;
    if (now - this.lastShotTime < interval) return null;
    this.lastShotTime = now;

    const cx    = this.position.x + this.width / 2;
    const by    = this.position.y + this.height * 0.78;
    const speed = this.isEnraged ? 6 : 5;
    // angles measured from straight-down (0 = down, positive = right)
    const angs  = this.isEnraged ? [-0.6, -0.3, 0, 0.3, 0.6] : [-0.45, 0, 0.45];

    return angs.map(a => ({
      x: cx,
      y: by,
      velocityX: speed * Math.sin(a),
      velocityY: speed * Math.cos(a),
    }));
  }

  // ─── Main draw ────────────────────────────────────────────────────────────

  draw() {
    const cx  = this.position.x + this.width  / 2;
    const cy  = this.position.y + this.height / 2;
    const t   = this.frame;

    const breathe    = Math.sin(t * 0.04)  * 2.5;
    const clawSwing  = Math.sin(t * 0.07)  * 0.28;
    const fingerOpen = 0.30 + 0.22 * Math.sin(t * 0.09);
    const eyeGlow    = 0.55 + 0.45 * Math.sin(t * 0.08);
    const antPulse   = 0.50 + 0.50 * Math.sin(t * 0.12);

    const isHit   = this.hitFlashFrames > 0;
    const enraged = this.isEnraged;

    const skin      = enraged ? '#cc6622' : '#3daa66';
    const skinDark  = enraged ? '#7a2200' : '#1a6633';
    const skinLight = enraged ? '#ff9944' : '#77ddaa';
    const eyeCol    = enraged ? '#ff4400' : '#00ffcc';
    const aura      = enraged ? '#ff2200' : '#00ff88';

    ctx.save();
    if (isHit) ctx.globalAlpha = 0.3 + 0.7 * (this.hitFlashFrames / HIT_FLASH_DUR);

    ctx.shadowColor = isHit ? '#ffffff' : aura;
    ctx.shadowBlur  = isHit ? 60 : 18 + breathe * 2;

    // claws drawn behind body
    this._drawClaw(cx - 52, cy + 12,  clawSwing, fingerOpen, -1, skin, skinDark, skinLight, enraged);
    this._drawClaw(cx + 52, cy + 12, -clawSwing, fingerOpen,  1, skin, skinDark, skinLight, enraged);

    // torso
    ctx.shadowBlur = isHit ? 30 : 8;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 28 + breathe * 0.3, 36, 32, 0, 0, Math.PI * 2);
    ctx.fillStyle = skin;
    ctx.fill();
    ctx.strokeStyle = skinDark; ctx.lineWidth = 2; ctx.stroke();
    // torso highlight
    ctx.beginPath();
    ctx.ellipse(cx - 10, cy + 18 + breathe * 0.3, 14, 10, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${enraged ? '255,200,120' : '140,255,190'}, 0.22)`;
    ctx.fill();

    // head
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 14 + breathe * 0.2, 42, 48, 0, 0, Math.PI * 2);
    ctx.fillStyle = skin;
    ctx.fill();
    ctx.strokeStyle = skinDark; ctx.lineWidth = 2; ctx.stroke();
    // head highlight
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 24 + breathe * 0.2, 14, 16, -0.25, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${enraged ? '255,200,120' : '140,255,190'}, 0.18)`;
    ctx.fill();

    // eyes
    ctx.shadowColor = eyeCol;
    ctx.shadowBlur  = 12 * eyeGlow;
    this._drawEye(cx - 17, cy - 22 + breathe * 0.2, -0.15, eyeCol, eyeGlow, enraged);
    this._drawEye(cx + 17, cy - 22 + breathe * 0.2,  0.15, eyeCol, eyeGlow, enraged);

    // nostrils
    ctx.shadowBlur = 0;
    ctx.fillStyle  = skinDark;
    ctx.beginPath(); ctx.ellipse(cx - 5, cy + 5 + breathe * 0.15, 2, 3.5,  0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 5, cy + 5 + breathe * 0.15, 2, 3.5, -0.2, 0, Math.PI * 2); ctx.fill();

    // mouth
    this._drawMouth(cx, cy + 14 + breathe * 0.15, skinDark, enraged);

    // antennae
    ctx.shadowColor = eyeCol;
    ctx.shadowBlur  = 8 * antPulse;
    this._drawAntenna(cx, cy, -1, t, antPulse, eyeCol, skinDark);
    this._drawAntenna(cx, cy,  1, t, antPulse, eyeCol, skinDark);

    ctx.restore();
  }

  // ─── Sub-draw helpers ─────────────────────────────────────────────────────

  _drawEye(x, y, tilt, eyeCol, glow, enraged) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // socket
    ctx.beginPath(); ctx.ellipse(0, 0, 13, 19, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#060606'; ctx.fill();
    ctx.strokeStyle = enraged ? '#551100' : '#115533'; ctx.lineWidth = 1.5; ctx.stroke();

    // iris
    ctx.beginPath(); ctx.ellipse(0, 2, 8, 13, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${enraged ? '255,70,0' : '0,230,175'}, ${0.2 + 0.3 * glow})`;
    ctx.fill();

    // vertical slit pupil
    ctx.shadowBlur = 10 * glow; ctx.shadowColor = eyeCol;
    ctx.beginPath(); ctx.ellipse(0, 0, 2.5, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = eyeCol; ctx.fill();

    ctx.restore();
  }

  _drawMouth(cx, my, darkCol, enraged) {
    ctx.beginPath();
    ctx.arc(cx, my, 15, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = darkCol; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = enraged ? '#ffbb88' : '#cceedd';
    [-9, -3, 3, 9].forEach(dx => {
      ctx.beginPath();
      ctx.moveTo(cx + dx,     my + 1);
      ctx.lineTo(cx + dx + 3, my + 7);
      ctx.lineTo(cx + dx + 6, my + 1);
      ctx.fill();
    });
  }

  _drawAntenna(cx, cy, side, t, pulse, eyeCol, darkCol) {
    const bx  = cx + side * 18;
    const by  = cy - 58;
    const cpx = cx + side * (32 + Math.sin(t * 0.05 + (side < 0 ? 0.5 : 0)) * 5);
    const cpy = cy - 78;
    const tx  = cx + side * 26;
    const ty  = cy - 96;

    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(cpx, cpy, tx, ty);
    ctx.strokeStyle = darkCol; ctx.lineWidth = 2; ctx.stroke();

    ctx.beginPath();
    ctx.arc(tx, ty, 4 + pulse * 2, 0, Math.PI * 2);
    ctx.fillStyle = eyeCol; ctx.fill();
  }

  _drawClaw(x, y, swingAngle, fingerOpen, side, skin, skinDark, skinLight, enraged) {
    ctx.save();
    ctx.translate(x, y);
    if (side === -1) ctx.scale(-1, 1); // mirror left claw
    ctx.rotate(swingAngle * side);

    // arm segment
    ctx.beginPath();
    ctx.moveTo(-4, -7); ctx.lineTo(26, -9);
    ctx.lineTo(26,  9); ctx.lineTo(-4,  7);
    ctx.fillStyle = skin; ctx.fill();
    ctx.strokeStyle = skinDark; ctx.lineWidth = 1.5; ctx.stroke();

    // arm highlight
    ctx.beginPath();
    ctx.moveTo(-2, -4); ctx.lineTo(23, -5);
    ctx.lineTo(23,  0); ctx.lineTo(-2,  0);
    ctx.fillStyle = `rgba(${enraged ? '255,200,120' : '140,255,190'}, 0.2)`;
    ctx.fill();

    ctx.translate(26, 0);

    // three fingers
    [-fingerOpen, 0, fingerOpen].forEach(angle => {
      ctx.save();
      ctx.rotate(angle);

      // finger body
      ctx.beginPath();
      ctx.moveTo(-2, -4); ctx.lineTo(20, -4);
      ctx.lineTo(20,  4); ctx.lineTo(-2,  4);
      ctx.fillStyle = skin; ctx.fill();
      ctx.strokeStyle = skinDark; ctx.lineWidth = 1; ctx.stroke();

      // sharp claw tip
      ctx.beginPath();
      ctx.moveTo(18, -5); ctx.lineTo(30, 0); ctx.lineTo(18, 6);
      ctx.closePath();
      ctx.fillStyle = skinLight; ctx.fill();
      ctx.strokeStyle = skinDark; ctx.lineWidth = 0.8; ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  // ─── HP bar (drawn outside screen-shake context) ──────────────────────────

  drawHpBar() {
    const barW    = 240;
    const barH    = 10;
    const barX    = this.canvasWidth / 2 - barW / 2;
    const barY    = 9;
    const hpRatio = this.hp / this.maxHp;
    const pulse   = 0.7 + 0.3 * Math.sin(this.frame * 0.08);
    const enraged = this.isEnraged;

    ctx.save();

    // label above bar
    ctx.shadowBlur   = 0;
    ctx.fillStyle    = enraged ? 'rgba(255,100,0,0.95)' : 'rgba(255,80,80,0.9)';
    ctx.font         = '7px "Press Start 2P", monospace';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(
      enraged ? `⚠ ENRAGED  ${this.hp}/${this.maxHp}` : `BOSS  ${this.hp}/${this.maxHp}`,
      this.canvasWidth / 2,
      barY - 1,
    );

    // bar background
    ctx.shadowColor = enraged ? '#ff4400' : '#ff0000';
    ctx.shadowBlur  = 5 * pulse;
    ctx.fillStyle   = '#1a0000';
    ctx.strokeStyle = enraged ? '#ff4400' : '#ff0000';
    ctx.lineWidth   = 1;
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeRect(barX, barY, barW, barH);

    // fill
    if (hpRatio > 0) {
      ctx.shadowColor = '#ff4444';
      ctx.shadowBlur  = 8 * pulse;
      const grad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
      grad.addColorStop(0, enraged ? '#ff4400' : '#ff0000');
      grad.addColorStop(1, enraged ? '#ffaa00' : '#ff8800');
      ctx.fillStyle = grad;
      ctx.fillRect(barX + 1, barY + 1, (barW - 2) * hpRatio, barH - 2);
    }

    ctx.restore();
  }
}
