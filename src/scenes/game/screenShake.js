let shakeDurationFrames = 0;
let shakeFramesRemaining = 0;
let shakeIntensity = 0;

export const triggerScreenShake = ({ intensity = 5, duration = 8 } = {}) => {
  shakeDurationFrames = Math.max(shakeDurationFrames, duration);
  shakeFramesRemaining = Math.max(shakeFramesRemaining, duration);
  shakeIntensity = Math.max(shakeIntensity, intensity);
};

export const updateScreenShake = () => {
  if (shakeFramesRemaining <= 0) {
    shakeDurationFrames = 0;
    shakeIntensity = 0;
    return;
  }

  shakeFramesRemaining -= 1;
};

export const applyScreenShake = (ctx) => {
  if (shakeFramesRemaining <= 0 || shakeDurationFrames <= 0) {
    return;
  }

  const progress = shakeFramesRemaining / shakeDurationFrames;
  const falloff = progress * progress;
  const magnitude = shakeIntensity * falloff;
  const angle = Math.random() * Math.PI * 2;

  ctx.translate(
    Math.cos(angle) * magnitude,
    Math.sin(angle) * magnitude * 0.75,
  );
};
