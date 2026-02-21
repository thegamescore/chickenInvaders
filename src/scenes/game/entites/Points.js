export class Points {
  constructor(eventPointsMap = {}) {
    this.totalPoints = 0;
    this.eventCounts = {};
    this.eventPointsMap = eventPointsMap;
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.comboExpiresAt = 0;

    this.COMBO_WINDOW_MS = 1800;
    this.COMBO_STEP = 3;
    this.MAX_COMBO_MULTIPLIER = 5;
  }

  getComboSnapshot() {
    const now = performance.now();
    const isActive = now <= this.comboExpiresAt && this.comboCount > 0;

    if (!isActive) {
      return {
        isActive: false,
        comboCount: 0,
        comboMultiplier: 1,
        timeLeftRatio: 0,
      };
    }

    return {
      isActive: true,
      comboCount: this.comboCount,
      comboMultiplier: this.comboMultiplier,
      timeLeftRatio: Math.max(0, (this.comboExpiresAt - now) / this.COMBO_WINDOW_MS),
    };
  }

  updateKillCombo(basePoints) {
    const now = performance.now();
    const isWindowActive = now <= this.comboExpiresAt;

    if (isWindowActive) {
      this.comboCount += 1;
    } else {
      this.comboCount = 1;
    }

    this.comboMultiplier = Math.min(
      1 + Math.floor((this.comboCount - 1) / this.COMBO_STEP),
      this.MAX_COMBO_MULTIPLIER,
    );

    this.comboExpiresAt = now + this.COMBO_WINDOW_MS;

    const earnedPoints = basePoints * this.comboMultiplier;
    this.totalPoints += earnedPoints;

    return {
      earnedPoints,
      comboMultiplier: this.comboMultiplier,
      comboCount: this.comboCount,
    };
  }

  updatePoints(eventName) {
    const points = this.eventPointsMap[eventName];
    if (typeof points !== "number") return { earnedPoints: 0, comboMultiplier: 1, comboCount: 0 };

    if (eventName === "KILL_PROJECTILE") {
      this.eventCounts[eventName] = (this.eventCounts[eventName] || 0) + 1;
      return this.updateKillCombo(points);
    }

    this.totalPoints += points;
    this.eventCounts[eventName] = (this.eventCounts[eventName] || 0) + 1;

    return {
      earnedPoints: points,
      comboMultiplier: 1,
      comboCount: this.comboCount,
    };
  }

  getTotalPoints() {
    return this.totalPoints;
  }

  drawPoints(ctx, canvasWidth) {
    const padding = 20;
    const width = 300;
    const height = 110;

    ctx.font = "18px 'Press Start 2P', monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    ctx.clearRect(canvasWidth - width, 0, width, height);

    ctx.fillStyle = "white";
    ctx.shadowColor = "#00FF00";
    ctx.shadowBlur = 4;

    ctx.fillText(`SCORE ${this.totalPoints}`, canvasWidth - padding, padding);

    const comboState = this.getComboSnapshot();
    if (comboState.isActive) {
      const comboY = padding + 32;
      const barWidth = 200;
      const barHeight = 10;
      const barX = canvasWidth - padding - barWidth;
      const barY = comboY + 26;

      ctx.fillStyle = "#ffdd57";
      ctx.shadowColor = "#ff8a00";
      ctx.shadowBlur = 8;
      ctx.fillText(
        `x${comboState.comboMultiplier} COMBO (${comboState.comboCount})`,
        canvasWidth - padding,
        comboY,
      );

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = "#ff8a00";
      ctx.fillRect(barX, barY, barWidth * comboState.timeLeftRatio, barHeight);
    }

    ctx.shadowBlur = 0;
  }

  reset() {
    this.totalPoints = 0;
    this.eventCounts = {};
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.comboExpiresAt = 0;
  }
}
