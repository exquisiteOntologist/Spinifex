const mainCanvas = document.getElementById('mainCanvas') as HTMLCanvasElement
const cW = mainCanvas.width = window.innerWidth
const cH = mainCanvas.height = cW * 0.56
const mainContext = mainCanvas.getContext('2d')

const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0e0e0e'
    ctx.fillRect(0, 0, cW, cH)
}

const deviate = (num: number, up: number, low: number): number => {
    const ran = Math.random() // 0.0 to 1.0
    const multi = ran + 0.5 // 0.5 to 1.5
    const deviation = num * multi
    if (deviation > (num * up)) return deviate(num, up, low)
    if (deviation < (num * low)) return deviate(num, up, low)
    return deviation
}

const maxMin = (num: number, max: number, min: number): number => {
    const numUp = Math.min(num, max) // no more than top
    const numLow = Math.max(numUp, min) // no less than bottom
    return numLow
}

const flip = (): -1 | 1 => Math.random() > 0.5 ? 1 : -1

interface GrassBlade {
    /** Direction multiplier (-1 OR 1) */
    xF: -1 | 1,
    /** Height */
    h: number,
    x: number,
    y: number,
    /** Mid-point X */
    x1: number,
    x2: number,
    /** Mid-point Y */
    y1: number,
    y2: number,
    /** Radians */
    rad: number,
    /** Colour */
    c: string,
    /** Line Width */
    lW: number
}

const drawGrassBlade = (ctx: CanvasRenderingContext2D, b: GrassBlade) => {
    updateGrassBlade(b)
    
    ctx.beginPath()
    ctx.strokeStyle = b.c
    ctx.lineWidth = b.lW
    ctx.moveTo(b.x, b.y)
    ctx.arcTo(b.x1, b.y1, b.x2, b.y2, b.rad)
    ctx.stroke()
    ctx.closePath()
}


const updateGrassBlade = (b: GrassBlade) => {
    const shift = deviate(0.5, 1, -1) * flip()
    b.x1 = maxMin(b.x1 + shift, b.x + 10, b.x - 10)
    b.x2 = maxMin(b.x2 + shift, b.x + 50, b.x - 50)
    // b.x2 += shift
    // Math.
}

const createGrassBlade = (x: number, y: number): GrassBlade => {
    const dX: number = deviate(x, 1.5, 0.5)
    const dY: number = y + (deviate(1, 1, 0) * flip())
    const xF = flip()
    const h = deviate(120, 2, 0.3)
    const rgb = 250 + (deviate(5, 1, -1) * flip())
    const alpha = 0.5 + deviate(0.25, 1.5, 0.5)

    const b: GrassBlade = {
        xF,
        h,
        x: dX,
        y: dY,
        x1: dX + (5 * xF),
        x2: dX + (35 * xF),
        y1: dY - (h/2),
        y2: dY - h,
        rad: deviate(30, 1.5, 0.5),
        c: `rgba(${rgb}, ${rgb}, ${rgb}, ${alpha})`,
        lW: 1
    }

    return b
}

const numBlades = 600
const grassBlades: GrassBlade[] = []
const drawGrassBlades = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    if (grassBlades.length <= numBlades) {
        for (let i = 0; i < numBlades; i++) {
            grassBlades.push(createGrassBlade(x, y))
        }
    }

    for (let i = 0; i < numBlades; i++) {
        drawGrassBlade(ctx, grassBlades[i])
    }
}

const times: number[] = [];
let fps: number = 0;
const animFrames = (ctx: CanvasRenderingContext2D) => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;

    ctx.fillStyle = '#fff'
    ctx.fillText(fps.toString(), 10, 20, 200)
    ctx.fillText(cW.toString(), 10, 60, 200)
    ctx.fillText(cH.toString(), 10, 100, 200)
}

const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, cW, cH)
    drawBackground(ctx)
    drawGrassBlades(ctx, cW / 2, cH / 2)
    animFrames(ctx)
    window.requestAnimationFrame(() => draw(ctx))
}

if (mainContext) draw(mainContext)

