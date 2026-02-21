export function isElementCollidingWithShip(element, ship) {
  return (
      element.position.x + element.width > ship.position.x &&
      element.position.x < ship.position.x + ship.width &&
      element.position.y + element.height > ship.position.y &&
      element.position.y < ship.position.y + ship.height
  );
}

export function isProjectTileCollidingWithInvader(projectile, invader) {
  // Projectile is drawn centered on position.x, so compute true left/right edges
  const projLeft = projectile.position.x - projectile.width / 2;
  const projRight = projLeft + projectile.width;
  const projTop = projectile.position.y;
  const projBottom = projTop + projectile.height;

  return (
    projRight > invader.position.x &&
    projLeft < invader.position.x + invader.width &&
    projBottom > invader.position.y &&
    projTop < invader.position.y + invader.height
  );
}

export const createIsOffScreen = (canvasWidth, canvasHeight) => ({ x, y }) =>
    x < 0 || x > canvasWidth || y < 0 || y > canvasHeight;