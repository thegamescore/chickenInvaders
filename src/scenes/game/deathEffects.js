import { ctx } from "./canvas.js";

const effects = [];

const PARTICLE_COUNT = 7;
const DURATION = 45; // frames
const COLORS = ["#00ffff", "#ffff00", "#ffffff", "#ff88ff"];

const createEffect = ({
  x,
  y,
  particleCount,
  duration,
  colors,
  minSpeed,
  maxSpeed,
  minSize,
  maxSize,
  gravity,
}) => {
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.4;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    particles.push({
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: minSize + Math.random() * (maxSize - minSize),
    });
  }

  effects.push({ particles, frame: 0, duration, gravity });
};

export function spawnDeathEffect(x, y) {
  createEffect({
    x,
    y,
    particleCount: PARTICLE_COUNT,
    duration: DURATION,
    colors: COLORS,
    minSpeed: 1.2,
    maxSpeed: 3,
    minSize: 2,
    maxSize: 4,
    gravity: 0.04,
  });
}

export function spawnShipDamageEffect(x, y) {
  createEffect({
    x,
    y,
    particleCount: 18,
    duration: 55,
    colors: ["#ff3d00", "#ff9800", "#ffd166", "#ffffff"],
    minSpeed: 1.4,
    maxSpeed: 3.8,
    minSize: 2.2,
    maxSize: 4.8,
    gravity: 0.06,
  });
}

export function updateAndDrawDeathEffects() {
  for (let i = effects.length - 1; i >= 0; i--) {
    const effect = effects[i];
    effect.frame++;

    if (effect.frame >= effect.duration) {
      effects.splice(i, 1);
      continue;
    }

    const alpha = 1 - effect.frame / effect.duration;

    effect.particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += effect.gravity;

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
