import {setRandomInterval} from "../../../helpers/helpers.js";

export class PresentsSpawner {
    constructor({ getCurrentLevel, levelDataMap, createPresent, onSpawn }) {
        this.getCurrentLevel = getCurrentLevel;
        this.levelDataMap = levelDataMap;
        this.createPresent = createPresent;
        this.onSpawn = onSpawn;

        this.presentsCounter = 0;
        this.intervalId = null;
    }

    start() {
        this.intervalId = setRandomInterval(() => {
            const currentLevel = this.getCurrentLevel();
            const levelData = this.levelDataMap[currentLevel];

            if (this.presentsCounter >= levelData.numberOfPresentsPerLevel) return;

            this.presentsCounter++;

            const present = this.createPresent();

            this.onSpawn(present);
        }, 1000, 2000);
    }

    stop() {
        if(this.intervalId){
            this.intervalId.clear()
        }
    }

    reset() {
        this.stop();
        this.presentsCounter = 0;
    }
}