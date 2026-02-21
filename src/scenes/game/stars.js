import { getRandomArrElement } from "../../helpers/helpers.js";
import { canvas, ctx } from "./canvas.js";

const stars = [];

const starColors = [
  { r: 255, g: 250, b: 240 },
  { r: 173, g: 216, b: 230 },
  { r: 255, g: 215, b: 0 },
  { r: 200, g: 220, b: 255 },
  { r: 255, g: 240, b: 220 },
];

// Three parallax layers: far (slow/tiny) → near (fast/large)
const layers = [
  { speed: 0.15, minSize: 0.3, maxSize: 0.8,  minAlpha: 0.2, maxAlpha: 0.5,  count: 80 },
  { speed: 0.4,  minSize: 0.8, maxSize: 1.8,  minAlpha: 0.4, maxAlpha: 0.75, count: 50 },
  { speed: 0.9,  minSize: 1.8, maxSize: 3.5,  minAlpha: 0.7, maxAlpha: 1.0,  count: 20 },
];

function createStar(layerIndex, startFromTop = false) {
  const layer = layers[layerIndex];
  const { r, g, b } = getRandomArrElement(starColors);
  const baseOpacity = layer.minAlpha + Math.random() * (layer.maxAlpha - layer.minAlpha);

  return {
    x: Math.random() * canvas.width,
    y: startFromTop ? -Math.random() * 10 : Math.random() * canvas.height,
    size: layer.minSize + Math.random() * (layer.maxSize - layer.minSize),
    baseOpacity,
    opacity: baseOpacity,
    twinkleSpeed: 0.4 + Math.random() * 0.8,
    twinklePhase: Math.random() * Math.PI * 2,
    speed: layer.speed,
    layerIndex,
    color: { r, g, b },
  };
}

export function initializeStars() {
  stars.length = 0;
  layers.forEach((_, i) => {
    for (let j = 0; j < layers[i].count; j++) {
      stars.push(createStar(i, false));
    }
  });
}

export function updateStars() {
  const time = performance.now() * 0.001;
  stars.forEach((star) => {
    star.y += star.speed;

    // gentle twinkle via sine wave
    star.opacity =
      star.baseOpacity + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.12;
    star.opacity = Math.max(0, Math.min(1, star.opacity));

    // respawn at top when scrolled off bottom
    if (star.y > canvas.height + star.size) {
      Object.assign(star, createStar(star.layerIndex, true));
    }
  });
}

export function drawStars() {
  stars.forEach((star) => {
    const { r, g, b } = star.color;
    ctx.save();
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}
