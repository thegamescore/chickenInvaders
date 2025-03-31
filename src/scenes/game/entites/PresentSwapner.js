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
        if (this.intervalId) return; // prevent double intervals

        this.intervalId = setInterval(() => {
            const currentLevel = this.getCurrentLevel();
            const levelData = this.levelDataMap[currentLevel];

            if (this.presentsCounter >= levelData.numberOfPresentsPerLevel) return;

            this.presentsCounter++;

            const present = this.createPresent();
            this.onSpawn(present);
        }, 1000);
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    reset() {
        this.stop();
        this.presentsCounter = 0;
    }
}