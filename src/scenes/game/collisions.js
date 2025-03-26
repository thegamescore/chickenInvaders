export function isElementCollidingWithShip(element, ship) {
  return (
      element.position.x + element.width > ship.position.x &&
      element.position.x < ship.position.x + ship.width &&
      element.position.y > ship.position.y &&
      element.position.y < ship.position.y + ship.height
  );
}

export function isProjectTileCollidingWithInvader(projectile, invader) {
  return (
    projectile.position.x >= invader.position.x &&
    projectile.position.x <= invader.position.x + invader.width &&
    projectile.position.y >= invader.position.y &&
    projectile.position.y <= invader.position.y + invader.height
  );
}

export const createIsOffScreen = (canvasWidth, canvasHeight) => ({ x, y }) =>
    x < 0 || x > canvasWidth || y < 0 || y > canvasHeight;