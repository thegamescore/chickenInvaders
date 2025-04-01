import { gameStates, MAX_LEVEL_REACHED } from "../../utils/const.js";

export class GameStateManager {
  constructor() {
    this.state = gameStates.IDLE;
    this.currentLevel = 0;
    this.listeners = new Set();
    this.config = {
      levels: null,
      maxLevel: null
    }
  }

  setConfig(config){
    this.config = config
  }

  getCurrentLevelData(){
    return this.config.levels[this.currentLevel]
  }

  getState() {
    return this.state;
  }

  getCurrentLevel() {
    if (this.currentLevel === this.config.maxLevel) {
      return MAX_LEVEL_REACHED;
    }

    return this.currentLevel;
  }

  updateCurrentLevel() {
    if (this.currentLevel === this.config.maxLevel) {
      return MAX_LEVEL_REACHED;
    }

    this.currentLevel += 1;
  }

  resetGame(){
    this.currentLevel = 0;
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.notifyListeners();
    }
  }

  onChange(listener) {
    this.listeners.add(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
