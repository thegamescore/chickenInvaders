import {PresentsSpawner} from "../entites/PresentSwapner.js";
import {LEVELS} from "../utils/gameConfig.js";
import {Present} from "../entites/Present.js";
import {canvas} from "../canvas.js";
import {assert } from "../../..//helpers/helpers.js"

export const PresentsModule = (() => {
    let presentsSpawner;



    const initializePresents = ({
                                    data, currentLevel, presentRegistry, levels, image
                                }) => {



        if(!presentRegistry){
            assert("provide presents registry")
        }

        if(!levels){
            assert("Add levels")
        }

        if(!currentLevel){
            assert("current level is not provided")
        }

        presentsSpawner = new PresentsSpawner({
            getCurrentLevel: currentLevel,
            levelDataMap: levels,
            createPresent: () => new Present({
                width: 50,
                height: 50,
                position: {
                    x: Math.floor(Math.random() * canvas.height), // Consider canvas.width if x relates to horizontal space
                    y: 50,
                },
                velocity: { x: 0, y: 0 },
                image,
            }),
            onSpawn: presentRegistry.appendPresent.bind(presentRegistry),
        });


    };

    const startSpawningPresents = () => {
        presentsSpawner.start()
    }

    const resetSpawningPresents = () => {
        presentsSpawner.reset()
    }


    return {
        initialize: initializePresents,
        startPresents: startSpawningPresents,
        resetPresents: resetSpawningPresents,
    };
})();