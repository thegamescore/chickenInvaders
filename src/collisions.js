export function isProjectTileCollidingWithShip(projectile, ship) {
    return (
        projectile.position.x + projectile.width > ship.position.x &&
        projectile.position.x < ship.position.x + ship.width &&
        projectile.position.y > ship.position.y &&
        projectile.position.y < ship.position.y + ship.height
    );
}

export function isProjectTileCollidingWithInvader(projectile,  invader){
    return projectile.position.x >= invader.position.x &&
        projectile.position.x <= invader.position.x + invader.width &&
        projectile.position.y >= invader.position.y &&
        projectile.position.y <= invader.position.y + invader.height
}