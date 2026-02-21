import ky from 'ky';

const gameServerDomain = import.meta.env.VITE_GAME_SERVER_DOMAIN;
export const isGameServerConfigured = Boolean(gameServerDomain);

if (!isGameServerConfigured) {
    console.warn("[game-server] VITE_GAME_SERVER_DOMAIN is not set. Remote match sync is disabled.");
}

const noopApi = {
    post: () => ({
        json: async () => null,
    }),
};

const api = isGameServerConfigured
    ? ky.create({
          prefixUrl: gameServerDomain,
          timeout: 10_000,
          headers: {
              'Content-Type': 'application/json',
          },
      })
    : noopApi;

export default api;
