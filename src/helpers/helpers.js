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

  console.log("run")

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