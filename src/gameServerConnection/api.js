import ky from 'ky';

console.log(import.meta.env)

if(!import.meta.env.VITE_GAME_SERVER_DOMAIN){
    throw new Error("Please provide VITE_GAME_SERVER_DOMAIN env")
}

const api = ky.create({
    prefixUrl: import.meta.env.VITE_GAME_SERVER_DOMAIN,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;