export function getGameData() {
    return new Promise((resolve) => {
        return setTimeout(() => {
            resolve({
                products: [
                    {
                        id: 1,
                        productImage: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
                    },
                    {
                        id: 2,
                        productImage: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
                    }
                ]
            })
        }, 1)
    })
}