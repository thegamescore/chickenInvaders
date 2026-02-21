import {gameOverEventName, gameStartEventName, levelTransitionEventName} from "../events.js";
import {GameServerService} from "./GameServerService.js";

//todo extract gameId from louncher
const gameId = 123

const gameService = new GameServerService()

window.addEventListener(gameStartEventName, () => {
    gameService.startGame(gameId)
})

//todo correct schema and data which should be sent to game server
window.addEventListener(levelTransitionEventName, (event) => {
    gameService.progress(gameId, {
        level: event.detail.currentLevel
    })
});

window.addEventListener(gameOverEventName, (event) => {
    gameService.complete(gameId)
});
