# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
npm run format    # Format code with Prettier
```

There are no tests in this project.

## Environment Variables

The game server connection requires `VITE_GAME_SERVER_DOMAIN` to be set (e.g. in a `.env` file). Without it, `src/gameServerConnection/api.js` will throw on load.

## Architecture

This is a vanilla JS canvas game built with Vite. No framework. The entry point is `index.html` → `src/index.js`.

### Scene Structure

All screens are rendered as HTML overlays in `index.html`. The canvas (`#chicken-invaders-canvas`) is the game surface. Each scene has its own script:

- `scenes/startScreen/` — shows before game starts, waits for `game-ready-event`
- `scenes/pauseScreen/` — pause overlay
- `scenes/gameOverScreen/` — displays score from `game-over` event detail
- `scenes/levelTransition/` — level number banner between levels
- `scenes/game/` — the actual game loop (canvas rendering)

### Event Bus

`src/events.js` is the central coordination layer. All scene transitions communicate via `CustomEvent` dispatched on `window`. Key events:

| Event | Trigger |
|---|---|
| `game-ready-event` | Config data loaded, start button enabled |
| `game-start` | Player clicks Start |
| `pause-game` / `unpause-game` | Pause toggled |
| `game-over` | Ship lives reach 0 (carries `detail.score`) |
| `level-transition` | All invaders cleared (carries `detail.currentLevel`) |
| `retry-game` | Player retries after game over |

### Game Loop (`scenes/game/main.js`)

- `GameStateManager` — state machine with states: `IDLE`, `RUNNING`, `PAUSED`, `GAME_OVER`, `LEVEL_TRANSITION`, `WIN`
- `draw()` — runs via `requestAnimationFrame`, clears canvas each frame, updates all entities
- State changes trigger `cleanUpScene()` / `resumeScene()` which manage shooting intervals and present spawning

### Config & Data Flow

`scenes/game/configData.js` calls `fake/faker.js` which returns a hardcoded game config (simulates an API). The config shape is:

```js
{
  products: [{ id, productImage }],   // used as invader/present images
  levels: { 0: { numberOfInvaders, gridSize, numberOfPresentsPerLevel }, ... },
  maxLevels: 4
}
```

`gameConfigAssert` validates that `maxLevels === Object.keys(levels).length`.

All game tuning constants (speeds, sizes, shooting mode, timing) live in `scenes/game/utils/gameConfig.js`. The shooting mode (`AUTO` vs `KEY_PRESS`) is set there.

### Game Server Connection (`src/gameServerConnection/`)

`GameServerService.ts` (TypeScript despite the rest being JS) uses `ky` to POST to a game server API. `gameServerConnection.js` wires it to window events. The `gameId` is currently hardcoded as `123` with a TODO to extract it from a launcher. The API base URL comes from `VITE_GAME_SERVER_DOMAIN`.

### Entities (`scenes/game/entites/`)

Each entity class handles its own drawing/updating on the canvas:
- `Ship` — player ship, tracks lives and position
- `Invaders` / `Invader` — grid of enemies with collective velocity
- `Projectile` / `InvaderProjectTile` — bullets; managed in `projectTiles.js` module-level arrays
- `Present` — collectible items (product images) that fall from top; managed by `PresentsRegistry` + `PresentsModule` (IIFE singleton)
- `Live` — heart icon drawn per remaining life
- `Points` — score tracker, accepts point event types as keys

### Collision Detection (`scenes/game/collisions.js`)

Simple AABB collision checks. `isProjectTileCollidingWithInvader` and `isElementCollidingWithShip` are called each frame inside the draw loop.
