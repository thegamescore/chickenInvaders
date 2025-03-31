import {getGameData} from "../../fake/faker.js";
import {setGameReady} from "../../events.js";

export let GAME_CONFIG_DATA = null;

export async function  getData() {
    const configData = await getGameData()

    GAME_CONFIG_DATA = configData

    setGameReady()
}


