export class Points {
  constructor(eventPointsMap = {}) {
    this.totalPoints = 0;
    this.eventCounts = {};
    this.eventPointsMap = eventPointsMap;
  }

  updatePoints(eventName) {
    const points = this.eventPointsMap[eventName];
    if (typeof points !== "number") return;
    this.totalPoints += points;
    this.eventCounts[eventName] = (this.eventCounts[eventName] || 0) + 1;
  }

  getTotalPoints() {
    return this.totalPoints;
  }

  drawPoints(ctx, canvasWidth) {
    const padding = 20;
    const width = 300;
    const height = 60;

    ctx.font = "18px 'Press Start 2P', monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    ctx.clearRect(canvasWidth - width, 0, width, height);

    ctx.fillStyle = "white";
    ctx.shadowColor = "#00FF00";
    ctx.shadowBlur = 4;

    ctx.fillText(`SCORE ${this.totalPoints}`, canvasWidth - padding, padding);

    ctx.shadowBlur = 0;
  }

  reset() {
    this.totalPoints = 0;
    this.eventCounts = {};
  }
}
