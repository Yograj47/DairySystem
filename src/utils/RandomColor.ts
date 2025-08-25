const randomNum = () => {
    const result = Math.floor(Math.random() * 256)
    return result
}

export function generateRandomColor() {
    const r: number = randomNum()
    const g: number = randomNum()
    const b: number = randomNum()

    return `rgb(${r},${g},${b})`
}
