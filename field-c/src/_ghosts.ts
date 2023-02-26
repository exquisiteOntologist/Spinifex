// Ghost

const ghostWidth = 90
const ghostHeight = 70
const tailHeight = 30
const ghostHalfWidth = ghostWidth / 2
const tailCircD = tailHeight / 2
const cGhostPink = '#F03EB0'
const cGhostPink2 = '#A72378'
const cGhostDarkPink = '#5C073D'
const cGhostShadowPink = '#530537'

export const drawGhost = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw Body

    // ctx.fillStyle = cGhostPink
    const gradBod = ctx.createLinearGradient(0, -ghostHeight, 0, 0)
    gradBod.addColorStop(0, cGhostPink)
    gradBod.addColorStop(1, cGhostDarkPink)
    ctx.fillStyle = gradBod

    ctx.translate(x, y)
    ctx.moveTo(0, 0)
    ctx.fillRect(-(ghostWidth / 2), 0, ghostWidth, -ghostHeight)

    // Draw Head

    // ctx.translate(x, y + ghostHeight * 2)
    ctx.moveTo(0, 0)
    ctx.fillStyle = cGhostPink2
    ctx.beginPath()
    ctx.ellipse(0, -ghostHeight, ghostWidth / 2, ghostWidth / 2, 0, 0, 360, false)
    ctx.fill()
    ctx.closePath()

    // Draw Tail

    // pixels of each shape intersect
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // ctx.globalCompositeOperation = "xor";
    // ctx.globalCompositeOperation = "destination-out";

    ctx.moveTo(0, 0)
    ctx.fillStyle = 'yellow'
    ctx.beginPath()
    ctx.fillRect(-(ghostWidth / 2), 0, ghostWidth, tailHeight / 2)
    ctx.fill()
    ctx.closePath()

    console.log('ghost circle', x, y, ghostHalfWidth)

    const pA = { x: tailCircD, y: 0 }
    const pB = { x: tailCircD / 2, y: tailCircD }
    const pC = { x: 0, y: 0 }

    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.resetTransform()
    ctx.beginPath()
    ctx.translate(x + pA.x, y + pA.y)
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'pink'
    ctx.moveTo(0, 0)
    // ctx.ellipse(-ghostHalfWidth + (tailCircRadius / 2), tailCircRadius, tailCircRadius, tailCircRadius, 0, 0, 360, false)
    // ctx.arc(-(ghostWidth / 2), tailCircRadius, tailCircRadius, 0, 180, false)
    // ctx.arcTo(-ghostHalfWidth + (tailCircRadius / 2), tailCircRadius + 100, -ghostHalfWidth + tailCircRadius, 0, 90)
    // ctx.arcTo(pB.x, pB.y, pC.x, pC.y, 360);
    ctx.arc(tailCircD, 0, tailCircD, 0, Math.PI * 1, false)
    // ctx.translate(x + pA.x - (ghostHalfWidth), y + pA.y + (tailCircD / 2))
    ctx.translate(x - 50 + pA.x, y + pA.y + (tailCircD / 2))
    ctx.moveTo(0, 0)
    ctx.arc(tailCircD, 0, tailCircD, 0, Math.PI * 1, false)
    // ctx.arc(tailCircD, tailCircD / 2, tailCircD, tailCircD / 2, Math.PI * 2, false)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()

    // ctx.globalCompositeOperation = "destination-out";
    // ctx.globalCompositeOperation = "xor";

    // ctx.moveTo(0, 0)
    // ctx.fillStyle = 'orange'
    // ctx.beginPath()
    // ctx.ellipse(-(ghostWidth / 2) + tailCircRadius + (tailCircRadius * 2), tailCircRadius, tailCircRadius, tailCircRadius, 0, 0, 360, false)
    // ctx.fill()
    // ctx.closePath()

    ctx.globalCompositeOperation = 'source-over'
    ctx.resetTransform()
}
