export function getGameData() {
    return new Promise((resolve) => {
        return setTimeout(() => {
            resolve({
                products: [
                    {
                        id: 1,
                        productImage: "https://www.shutterstock.com/image-illustration/3d-render-number-eight-digital-260nw-2015739203.jpg"
                    },
                    {
                        id: 2,
                        productImage: "https://www.shutterstock.com/image-illustration/3d-render-number-eight-digital-260nw-2015739203.jpg"
                    }
                ],
                levels: {
                    0: {
                        numberOfInvaders: 1,
                        gridSize: 1,
                        numberOfPresentsPerLevel: 25
                    },
                    1: {
                        numberOfInvaders: 25,
                        gridSize: 5,
                        numberOfPresentsPerLevel: 3
                    },
                    2: {
                        numberOfInvaders: 50,
                        gridSize: 10,
                        numberOfPresentsPerLevel: 4
                    },
                    3: {
                        numberOfInvaders: 100,
                        gridSize: 25,
                        numberOfPresentsPerLevel: 1
                    },
                },
                maxLevels: 4
            })
        }, 1)
    })
}