export class GameServerService {
  constructor() {
    this.sessions = new Map();
  }

  async withLatency(payload) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return payload;
  }

  getSession(gameId) {
    if (!this.sessions.has(gameId)) {
      this.sessions.set(gameId, {
        startedAt: Date.now(),
        progress: [],
        completed: false,
        finalProgress: null,
      });
    }

    return this.sessions.get(gameId);
  }

  async startGame(gameId) {
    const session = this.getSession(gameId);
    session.startedAt = Date.now();
    session.progress = [];
    session.completed = false;
    session.finalProgress = null;

    return this.withLatency({
      status: "ok",
      mode: "mock",
      gameId,
      startedAt: session.startedAt,
    });
  }

  async progress(gameId, progress) {
    const session = this.getSession(gameId);
    session.progress.push({
      timestamp: Date.now(),
      ...progress,
    });

    return this.withLatency({
      status: "ok",
      mode: "mock",
      gameId,
      progressCount: session.progress.length,
    });
  }

  async complete(gameId, progress) {
    const session = this.getSession(gameId);
    session.completed = true;
    session.finalProgress = progress ?? null;

    return this.withLatency({
      status: "ok",
      mode: "mock",
      gameId,
      completedAt: Date.now(),
      progressCount: session.progress.length,
    });
  }

  async getLeaderBoard(gameId, { limit = 10 }) {
    const session = this.getSession(gameId);
    const cappedLimit = Math.max(1, Math.min(limit, 50));
    const leaderboard = Array.from({ length: cappedLimit }, (_, index) => {
      const place = index + 1;

      return {
        place,
        player: `Player ${place}`,
        score: Math.max(0, 2000 - index * 123),
        gameId,
      };
    });

    return this.withLatency({
      status: "ok",
      mode: "mock",
      gameId,
      entries: leaderboard,
      sessionProgressCount: session.progress.length,
    });
  }
}
