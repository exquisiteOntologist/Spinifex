import { createBall, drawBall, initBallControl, updateBall } from './_ball'
import { drawShrub } from './_shrub'
import { cStraw, cStrawLight, drawGrassBlades, GrassBlade } from './_spinifex'
import { Presence } from './_types'

const mainCanvas = document.getElementById('mainCanvas') as HTMLCanvasElement
const cW = mainCanvas.width = window.innerWidth
const cH = mainCanvas.height = cW * 0.56
const mainContext = mainCanvas.getContext('2d')



const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0e0e0e'
    ctx.fillRect(0, 0, cW, cH)
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


const grassBladesA: GrassBlade[] = []
const grassBladesB: GrassBlade[] = []
const grassBladesC: GrassBlade[] = []

const b = createBall(cW / 2, (cH / 2) + 100)
initBallControl(b)

const sceneObjects: Presence[] = [b]

const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, cW, cH)
    drawBackground(ctx)
    drawShrub(ctx, (cW / 2) - 250, (cH / 2) - 60)
    drawGrassBlades(ctx, cW / 2 - 30, cH / 2 - 10, cStraw, grassBladesA, sceneObjects)
    drawShrub(ctx, (cW / 2) * 1.5, (cH / 2) - 19)
    drawGrassBlades(ctx, cW / 2 + 20, cH / 2 - 5, cStrawLight, grassBladesB, sceneObjects)
    drawGrassBlades(ctx, cW / 2, cH / 2, cStraw, grassBladesC, sceneObjects)
    drawShrub(ctx, (cW / 2) - 80, (cH / 2) + 20)
    updateBall(b)
    drawBall(ctx, b)
    animFrames(ctx)
    window.requestAnimationFrame(() => draw(ctx))
}

if (mainContext) draw(mainContext)

