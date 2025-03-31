import {getGameData} from "../../fake/faker.js";
import {setGameReady} from "../../events.js";


export async function  getData() {
    const configData = await getGameData()
    setGameReady()
    return configData
}


