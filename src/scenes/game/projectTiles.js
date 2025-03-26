import {Projectile} from "./entites/Projectile.js";
import {INVADER_HEIGHT, INVADER_WIDTH, PROJECT_TILE_DIMENSIONS, PROJECT_TILE_SPEED} from "./utils/gameConfig.js";
import {getRandomArrElement} from "../../helpers/helpers.js";
import {InvaderProjectTile} from "./entites/InvaderProjectTile.js";
import ProjectTileInvaderImagePng from "../../assets/projecttile-invader.png";
import {EntityRegistry} from "./entites/EntityRegistry.js";


const entityRegistry = new EntityRegistry()

export const projectTiles = entityRegistry.getProjectTiles()
export const invadersProjectTile = entityRegistry.getInvadersProjectTile()

export const removeProjectile = (index) => {
    entityRegistry.removeProjectTile(index)
}

export const removeInvadersProjectTile = (index) => {
    entityRegistry.removeInvadersProjectTile(index)
}

export const appendProjectTile = ({ship}) => () => {
    entityRegistry.appendProjectTile(
        new Projectile({
            position: { x: ship.position.x + ship.width / 2, y: ship.position.y },
            velocity: { x: 0, y: PROJECT_TILE_SPEED },
            width: PROJECT_TILE_DIMENSIONS.width,
            height: PROJECT_TILE_DIMENSIONS.height,
        }),
    );
};

export const appendInvaderProjectTile = ({invaders, ship}) => ()  => {
    const randomInvader = getRandomArrElement(invaders);

    if (!randomInvader) return;

    entityRegistry.appendInvader(
        new InvaderProjectTile({
            startPosition: {
                x: randomInvader.position.x + INVADER_WIDTH / 2,
                y: randomInvader.position.y + INVADER_HEIGHT / 2,
            },
            targetPosition: { x: ship.position.x, y: ship.position.y },
            speed: 4,
            width: 50,
            height: 50,
            imagePng: ProjectTileInvaderImagePng,
        }),
    );
};

export const resetEntityRegistry = () => {
    entityRegistry.reset()
}