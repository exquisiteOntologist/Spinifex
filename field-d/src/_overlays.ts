
const cLetterboxOuter = 'rgba(0, 0, 0, 0.9)'
const cLetterboxInner = 'rgba(255, 255, 255, 0)'

export const drawLetterbox = (ctx: CanvasRenderingContext2D, intensity: number = 1) => {
    const w = ctx.canvas.width
    const h = ctx.canvas.height

    const innerX = w / 2
    const outerX = innerX
    const innerY = h / 2
    const outerY = h / 2
    const innerRad = h * 0.3
    const outerRad = h * 0.9

    const letterboxGrad = ctx.createLinearGradient(0, 0, 0, h)
    letterboxGrad.addColorStop(0.05, cLetterboxOuter)
    letterboxGrad.addColorStop(0.24, cLetterboxInner)
    letterboxGrad.addColorStop(0.76, cLetterboxInner)
    letterboxGrad.addColorStop(0.95, cLetterboxOuter)
    // const letterboxRadGrad = ctx.createRadialGradient(innerX, innerY, innerRad, outerX, outerY, outerRad)
    // letterboxRadGrad.addColorStop(0.00, cLetterboxInner)
    // letterboxRadGrad.addColorStop(0.76, cLetterboxInner)
    // letterboxRadGrad.addColorStop(0.95, cLetterboxOuter)

    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = letterboxGrad
    ctx.fillRect(0, 0, w, h)
    // ctx.transform(1, 0, 0, 0.9, 0, 0);
    // ctx.fillStyle = letterboxRadGrad
    // ctx.fillRect(0, 0, w, h)
    ctx.transform(0, 0, 0, 0, 0, 0)
    ctx.resetTransform()
    ctx.globalCompositeOperation = 'source-over'
}

