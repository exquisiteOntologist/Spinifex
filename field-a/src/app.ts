const mainCanvas = document.getElementById('mainCanvas') as HTMLCanvasElement
const cW = mainCanvas.width = window.innerWidth
const cH = mainCanvas.height = cW * 0.56
const mainContext = mainCanvas.getContext('2d')

// const renderCanvas = document.

const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0e0e0e'
    ctx.fillRect(0, 0, cW, cH)
}

const deviate = (num: number, up: number, low: number): number => {
    const ran = Math.random()
    const mid = ran + 0.5
    const deviation = num * mid
    if (deviation > num * up) return deviate(num, up, low)
    if (deviation < num * low) return deviate(num, up, low)
    return deviation
}

const flip = (): number => Math.random() > 0.5 ? 1 : -1

const drawGrassBlade = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const xF = flip()
    const h = deviate(120, 2, 0.3)
    const x1 = x + (5 * xF)
    const x2 = x + (35 * xF)
    const y1 = y - (h/2)
    const y2 = y - h
    ctx.beginPath()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.moveTo(x, y)
    ctx.arcTo(x1, y1, x2, y2, 40)
    ctx.stroke()
    ctx.closePath()
}

const drawGrassBlades = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const numBlades = 30
    for (let i = 0; i < numBlades; i++) {
        const dX: number = deviate(x, 1.5, 0.5)
        drawGrassBlade(ctx, dX, y)
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

