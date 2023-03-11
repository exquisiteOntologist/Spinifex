
const cLetterboxOuter = 'rgba(0, 0, 0, 0.9)'
const cLetterboxInner = 'rgba(255, 255, 255, 0)'

export const drawLetterbox = (ctx: CanvasRenderingContext2D, intensity: number = 1) => {
    const w = ctx.canvas.width
    const h = ctx.canvas.height

    const letterboxGrad = ctx.createLinearGradient(0, 0, 0, h)
    letterboxGrad.addColorStop(0.05, cLetterboxOuter)
    letterboxGrad.addColorStop(0.24, cLetterboxInner)
    letterboxGrad.addColorStop(0.76, cLetterboxInner)
    letterboxGrad.addColorStop(0.95, cLetterboxOuter)

    ctx.fillStyle = letterboxGrad
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
}

