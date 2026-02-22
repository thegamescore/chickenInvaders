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
                        productImage: "https://pe-images.s3.amazonaws.com/basics/cc/image-size-resolution/resize-images-for-print/image-cropped-8x10.jpg"
                    }
                ],
                levels: {
                    0:  { numberOfInvaders: 20,  gridSize: 5,  numberOfPresentsPerLevel: 6 },
                    1:  { numberOfInvaders: 24,  gridSize: 6,  numberOfPresentsPerLevel: 6 },
                    2:  { numberOfInvaders: 30,  gridSize: 6,  numberOfPresentsPerLevel: 5 },
                    3:  { numberOfInvaders: 35,  gridSize: 7,  numberOfPresentsPerLevel: 5 },
                    4:  { numberOfInvaders: 42,  gridSize: 7,  numberOfPresentsPerLevel: 5 },
                    5:  { numberOfInvaders: 40,  gridSize: 8,  numberOfPresentsPerLevel: 5 },
                    6:  { numberOfInvaders: 48,  gridSize: 8,  numberOfPresentsPerLevel: 4 },
                    7:  { numberOfInvaders: 45,  gridSize: 9,  numberOfPresentsPerLevel: 4 },
                    8:  { numberOfInvaders: 54,  gridSize: 9,  numberOfPresentsPerLevel: 4 },
                    9:  { numberOfInvaders: 50,  gridSize: 10, numberOfPresentsPerLevel: 4 },
                    10: { numberOfInvaders: 60,  gridSize: 10, numberOfPresentsPerLevel: 3 },
                    11: { numberOfInvaders: 55,  gridSize: 11, numberOfPresentsPerLevel: 3 },
                    12: { numberOfInvaders: 66,  gridSize: 11, numberOfPresentsPerLevel: 3 },
                    13: { numberOfInvaders: 60,  gridSize: 12, numberOfPresentsPerLevel: 3 },
                    14: { numberOfInvaders: 72,  gridSize: 12, numberOfPresentsPerLevel: 3 },
                    15: { numberOfInvaders: 60,  gridSize: 10, numberOfPresentsPerLevel: 3 },
                    16: { numberOfInvaders: 66,  gridSize: 11, numberOfPresentsPerLevel: 3 },
                    17: { numberOfInvaders: 72,  gridSize: 12, numberOfPresentsPerLevel: 2 },
                    18: { numberOfInvaders: 60,  gridSize: 10, numberOfPresentsPerLevel: 2 },
                    19: { numberOfInvaders: 66,  gridSize: 11, numberOfPresentsPerLevel: 2 },
                    20: { numberOfInvaders: 72,  gridSize: 12, numberOfPresentsPerLevel: 2 },
                    21: { numberOfInvaders: 60,  gridSize: 10, numberOfPresentsPerLevel: 2 },
                    22: { numberOfInvaders: 66,  gridSize: 11, numberOfPresentsPerLevel: 2 },
                    23: { numberOfInvaders: 72,  gridSize: 12, numberOfPresentsPerLevel: 2 },
                    24: { numberOfInvaders: 72,  gridSize: 12, numberOfPresentsPerLevel: 2 },
                },
                maxLevels: 25
            })
        }, 1)
    })
}
