export function getRandomArrElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}



export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
