import { getRandomArrElement } from "../../helpers/helpers.js";
import { canvas, ctx } from "./canvas.js";

const stars = [];
const maxStars = 50;

const starColors = [
  { name: "Bright White Star", r: 255, g: 250, b: 240, a: 0.9 },
  { name: "Blue Star", r: 173, g: 216, b: 230, a: 0.8 },
  { name: "Golden Star", r: 255, g: 215, b: 0, a: 0.85 },
];

export function initializeStars() {
  for (let i = 0; i < maxStars; i++) {
    const randomStar = getRandomArrElement(starColors);
    const { r, g, b } = randomStar;

    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      opacity: Math.random(),
      fadeSpeed: 0.01,
      increasing: Math.random() > 0.5,
      color: { r, g, b },
    });
  }
}

export function updateStars() {
  stars.forEach((star) => {
    if (star.increasing) {
      star.opacity += star.fadeSpeed;
      if (star.opacity >= 1) star.increasing = false;
    } else {
      star.opacity -= star.fadeSpeed;
      if (star.opacity <= 0) {
        star.increasing = true;
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
      }
    }
  });
}

export function drawStars() {
  stars.forEach((star) => {

    const { r, g, b } = star.color;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore()

  });
}
