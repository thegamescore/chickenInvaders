import { keyMap } from "../../utils/const.js";

import {
  ROTATION_ANGLE,
  SHIP_VELOCITY,
  SHIP_WIDTH,
} from "./utils/gameConfig.js";
import { canvasWidth } from "./canvas.js";

/** @type {Record<string, boolean>} */
export const keyPressedMap = Object.fromEntries(
  Object.keys(keyMap).map((key) => [key, false]),
);

export const updateKeyState = (event, isPressed) => {
  for (const [action, key] of Object.entries(keyMap)) {
    if (event.code === key) {
      keyPressedMap[action] = isPressed;
    }
  }
};

export const setKeyState = (action, isPressed) => {
  keyPressedMap[action] = isPressed;
};

export function updateShipPosition(ship) {
  if (keyPressedMap["TURN_LEFT"]) {
    //prevent ship from overlapping map
    if (ship.position.x <= 0) {
      ship.resetShip();
      return;
    }

    ship.velocity.x = -SHIP_VELOCITY;
    ship.rotation = -ROTATION_ANGLE;
    return;
  }

  if (keyPressedMap["TURN_RIGHT"]) {
    //prevent ship from overlapping map
    if (ship.position.x >= canvasWidth - SHIP_WIDTH) {
      ship.resetShip();
      return;
    }

    ship.velocity.x = SHIP_VELOCITY;
    ship.rotation = ROTATION_ANGLE;
    return;
  }

  ship.resetShip();
}
