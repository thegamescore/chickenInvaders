import {gameStates} from "../../utils/const.js";

export class GameStateManager {
    constructor() {
        this.state = gameStates.IDLE;
        this.listeners = new Set();
    }

    getState() {
        return this.state;
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
        this.listeners.forEach(listener => listener(this.state));
    }
}