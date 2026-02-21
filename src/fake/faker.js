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
                    0: {
                        numberOfInvaders: 20,  // 4 rows × 5 cols
                        gridSize: 5,
                        numberOfPresentsPerLevel: 5
                    },
                    1: {
                        numberOfInvaders: 30,  // 5 rows × 6 cols
                        gridSize: 6,
                        numberOfPresentsPerLevel: 4
                    },
                    2: {
                        numberOfInvaders: 42,  // 6 rows × 7 cols
                        gridSize: 7,
                        numberOfPresentsPerLevel: 4
                    },
                    3: {
                        numberOfInvaders: 48,  // 6 rows × 8 cols (max rows capped to 6)
                        gridSize: 8,
                        numberOfPresentsPerLevel: 3
                    },
                    4: {
                        numberOfInvaders: 54,  // 6 rows × 9 cols (max rows capped to 6)
                        gridSize: 9,
                        numberOfPresentsPerLevel: 2
                    },
                },
                maxLevels: 5
            })
        }, 1)
    })
}
