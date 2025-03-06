export function getRandomArrElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function removeProjectile(projectTiles, index) {
  projectTiles.splice(index, 1);
}
