// Sky, Ground, ETC.

export const drawBackground = (ctx: CanvasRenderingContext2D, x, y, w, h) => {
    ctx.fillStyle = '#0e0e0e'
    ctx.fillRect(0, 0, w, h)
}

const skyBlueHemishphere = 'rgb(83, 100, 128)'
const skyBlueHorizon = 'rgb(115, 118, 126)'

export const drawSkyBackground = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
    skyGrad.addColorStop(0, skyBlueHemishphere)
    skyGrad.addColorStop(1, skyBlueHorizon)

    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, w, h)
}

const grassSandColour = '#7A6B5A'
const grassSandColourAlpha = 'rgba(122, 107, 90, 1)'

export const drawBasicGround = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = grassSandColourAlpha
    ctx.moveTo(width / 2, height / 2)
    ctx.rotate(-0.05)
    ctx.fillRect(x, y, width, height)
    ctx.resetTransform()
}
