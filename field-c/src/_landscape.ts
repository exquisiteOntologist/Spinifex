// Sky, Ground, ETC.

export const drawBackground = (ctx: CanvasRenderingContext2D, x, y, w, h) => {
    ctx.fillStyle = '#0e0e0e'
    ctx.fillRect(0, 0, w, h)
}

const grassSandColour = '#7A6B5A'
const grassSandColourAlpha = 'rgba(122, 107, 90, 0.4)'

export const drawBasicGround = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = grassSandColourAlpha
    ctx.moveTo(width / 2, height / 2)
    ctx.rotate(-0.05)
    ctx.fillRect(x, y, width, height)
    ctx.resetTransform()
}
