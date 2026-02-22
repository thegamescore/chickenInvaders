import {Projectile} from "./entites/Projectile.js";
import {INVADER_HEIGHT, INVADER_WIDTH, PROJECT_TILE_DIMENSIONS, PROJECT_TILE_SPEED} from "./utils/gameConfig.js";
import {getRandomArrElement} from "../../helpers/helpers.js";
import {InvaderProjectTile} from "./entites/InvaderProjectTile.js";
import ProjectTileInvaderImagePng from "../../assets/projectile-invader.svg";
import {EntityRegistry} from "./entites/EntityRegistry.js";
import {playInvaderChargeSound, playInvaderShootSound, playShootSound} from "./audio.js";
import {ctx} from "./canvas.js";


const entityRegistry = new EntityRegistry()
const invaderShotTelegraphs = [];
const INVADER_SHOT_TELEGRAPH_DELAY_MS = 430;
const INVADER_SHOT_TELEGRAPH_PULSE_SPEED = 0.022;

export const projectTiles = entityRegistry.getProjectTiles()
export const invadersProjectTile = entityRegistry.getInvadersProjectTile()

export const removeProjectile = (index) => {
    entityRegistry.removeProjectTile(index)
}

export const removeInvadersProjectTile = (index) => {
    entityRegistry.removeInvadersProjectTile(index)
}

export const appendProjectTile = ({ship}) => () => {
    playShootSound();
    entityRegistry.appendProjectTile(
        new Projectile({
            position: { x: ship.position.x + ship.width / 2, y: ship.position.y },
            velocity: { x: 0, y: PROJECT_TILE_SPEED },
            width: PROJECT_TILE_DIMENSIONS.width,
            height: PROJECT_TILE_DIMENSIONS.height,
        }),
    );
};

export const appendSpreadProjectTiles = ({ship}) => () => {
    playShootSound();
    [-2.5, 0, 2.5].forEach(vx => {
        entityRegistry.appendProjectTile(new Projectile({
            position: { x: ship.position.x + ship.width / 2, y: ship.position.y },
            velocity: { x: vx, y: PROJECT_TILE_SPEED },
            width: PROJECT_TILE_DIMENSIONS.width,
            height: PROJECT_TILE_DIMENSIONS.height,
        }));
    });
};

export const appendInvaderProjectTile = ({invaders, ship}) => ()  => {
    const randomInvader = getRandomArrElement(invaders);

    if (!randomInvader) return;

    const now = performance.now();

    invaderShotTelegraphs.push({
      createdAt: now,
      fireAt: now + INVADER_SHOT_TELEGRAPH_DELAY_MS,
      sourceInvader: randomInvader,
      invadersRef: invaders,
      ship,
    });

    playInvaderChargeSound();
};

export const updateAndDrawInvaderShotTelegraphs = () => {
  const now = performance.now();

  for (let i = invaderShotTelegraphs.length - 1; i >= 0; i -= 1) {
    const telegraph = invaderShotTelegraphs[i];
    const isSourceInvaderAlive = telegraph.invadersRef.includes(telegraph.sourceInvader);

    if (!isSourceInvaderAlive) {
      invaderShotTelegraphs.splice(i, 1);
      continue;
    }

    const sourcePosition = {
      x: telegraph.sourceInvader.position.x + INVADER_WIDTH / 2,
      y: telegraph.sourceInvader.position.y + INVADER_HEIGHT / 2,
    };

    const targetPosition = {
      x: telegraph.ship.position.x + telegraph.ship.width / 2,
      y: telegraph.ship.position.y + telegraph.ship.height / 2,
    };

    const progress = Math.min(1, (now - telegraph.createdAt) / INVADER_SHOT_TELEGRAPH_DELAY_MS);
    const pulse = 0.5 + 0.5 * Math.sin((now - telegraph.createdAt) * INVADER_SHOT_TELEGRAPH_PULSE_SPEED);

    ctx.save();
    ctx.strokeStyle = `rgba(255, 115, 115, ${0.2 + pulse * 0.55})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sourcePosition.x, sourcePosition.y);
    ctx.lineTo(targetPosition.x, targetPosition.y);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 160, 110, ${0.5 + pulse * 0.35})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sourcePosition.x, sourcePosition.y, 10 + progress * 16 + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 80, 40, ${0.12 + progress * 0.25})`;
    ctx.beginPath();
    ctx.arc(sourcePosition.x, sourcePosition.y, 6 + progress * 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (now < telegraph.fireAt) {
      continue;
    }

    playInvaderShootSound();
    entityRegistry.appendInvader(
      new InvaderProjectTile({
        startPosition: sourcePosition,
        targetPosition,
        speed: 4,
        width: 50,
        height: 50,
        imagePng: ProjectTileInvaderImagePng,
      }),
    );

    invaderShotTelegraphs.splice(i, 1);
  }
};

export const resetEntityRegistry = () => {
    entityRegistry.reset()
    invaderShotTelegraphs.length = 0;
}
