// If this config is meant to be extended or customized, ensure it stays consistent
// with the system game configuration to avoid divergence or misalignment.

//GAME CONFIG SETTINGS
import { availableShootingModes } from "../../../utils/const.js";

export const MODE = availableShootingModes.AUTO;

//GAME ASSET SETTINGS
export const SHIP_WIDTH = 50;
export const SHIP_HEIGHT = 50;
export const SHIP_VELOCITY = 10;
export const SHIP_START_BOTTOM_OFFSET = 110;
export const ROTATION_ANGLE = 0.15;
export const INVADER_WIDTH = 87.5;
export const INVADER_HEIGHT = 47.5;
export const INVADERS_START_Y = 120;
export const INVADERS_GAP_X = 75;
export const INVADERS_GAP_Y = 100;
export const INVADERS_VELOCITY = 2;

export const INTERVAL_BETWEEN_SHOOTING_IN_MS = 200;
export const PROJECT_TILE_SPEED = 5;
export const PROJECT_TILE_DIMENSIONS = {
  width: 25,
  height: 25,
};

//LEVEL CONFIG
export const LEVEL_TRANSITION_DELAY_MS = 2000;

export const gameConfigAssert = (config) =>{
    const { maxLevels, levels } = config;

    if(maxLevels !== Object.keys(levels)?.length ){
      throw new Error("Unexpected configs, provided levels must equal max levels.")
    }
}
