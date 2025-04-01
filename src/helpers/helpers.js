export function getRandomArrElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}



export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
  let timeout;

  const runInterval = () => {
    const timeoutFunction = () => {
      intervalFunction();
      runInterval();
    };

    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    timeout = setTimeout(timeoutFunction, delay);
  };

  runInterval();

  return {
    clear() { clearTimeout(timeout) },
  };
};

const preloadImage = src =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image);
      image.onerror = reject
      image.src = src
    })


export const preloadImages = async (products) => {
  return await Promise.all(products.map(x => preloadImage(x.productImage)))
}