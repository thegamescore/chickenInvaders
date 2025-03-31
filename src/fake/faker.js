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
                ]
            })
        }, 1)
    })
}