import { ctx } from "./canvas.js";

const effects = [];

const PARTICLE_COUNT = 7;
const DURATION = 45; // frames
const COLORS = ["#00ffff", "#ffff00", "#ffffff", "#ff88ff"];

export function spawnDeathEffect(x, y) {
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const speed = 1.2 + Math.random() * 1.8;
    particles.push({
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 2 + Math.random() * 2,
    });
  }
  effects.push({ particles, frame: 0 });
}

export function updateAndDrawDeathEffects() {
  for (let i = effects.length - 1; i >= 0; i--) {
    const effect = effects[i];
    effect.frame++;

    if (effect.frame >= DURATION) {
      effects.splice(i, 1);
      continue;
    }

    const alpha = 1 - effect.frame / DURATION;

    effect.particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.04; // gentle gravity

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}
