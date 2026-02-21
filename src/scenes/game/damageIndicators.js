import { ctx } from "./canvas.js";

const indicators = [];

export const spawnDamageIndicator = ({
  x,
  y,
  text,
  color = "#ffffff",
  ttl = 34,
  velocityX = 0,
  velocityY = -1.2,
}) => {
  indicators.push({
    x,
    y,
    text,
    color,
    ttl,
    age: 0,
    velocityX,
    velocityY,
  });
};

export const updateAndDrawDamageIndicators = () => {
  for (let i = indicators.length - 1; i >= 0; i--) {
    const indicator = indicators[i];

    indicator.age += 1;

    if (indicator.age >= indicator.ttl) {
      indicators.splice(i, 1);
      continue;
    }

    const progress = indicator.age / indicator.ttl;
    const alpha = 1 - progress;
    const scale = 0.85 + progress * 0.35;

    indicator.x += indicator.velocityX;
    indicator.y += indicator.velocityY;
    indicator.velocityY += 0.015;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(indicator.x, indicator.y);
    ctx.scale(scale, scale);

    ctx.font = "700 15px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
    ctx.strokeText(indicator.text, 0, 0);

    ctx.fillStyle = indicator.color;
    ctx.shadowColor = indicator.color;
    ctx.shadowBlur = 10;
    ctx.fillText(indicator.text, 0, 0);

    ctx.restore();
  }
};
