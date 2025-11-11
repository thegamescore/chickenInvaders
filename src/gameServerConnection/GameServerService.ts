import api from './api'

//todo update progress to correct data shape when created
export class GameServerService {
    async startGame(gameId: number){
        return await api.post(`matches/start/${gameId}`).json();    }

    async progress(gameId: number, progress: any){
        return await api.post(`matches/${gameId}/progress`).json()
    }

    async complete(gameId: number, progress){
        return api.post(`matches/${gameId}/complete`, {
            json: { progress },
        }).json();
    }

    async getLeaderBoard(gameId: number, {limit = 10}: {limit: number}){
        return await api.post(`analytics/games/${gameId}/leaderboard?limit=${limit}`).json()
    }
}