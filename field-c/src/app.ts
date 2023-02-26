import { Loopable, animate, renderAnims } from './utils/_anim'
import { animFrames } from './utils/_debugging'
import { createBall, drawBall, initBallControl, updateBall } from './_ball'
import { drawGhost } from './_ghosts'
import { createShrub, drawShrub, Shrub, ShrubLoop } from './_shrub'
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

const grassBladesA: GrassBlade[] = []
const grassBladesB: GrassBlade[] = []
const grassBladesC: GrassBlade[] = []
// const shrubA: Shrub = {}
const shrubA = new ShrubLoop(300, 200, 300 / 2, 200 / 2)
// const shrubB: Shrub = {}
const shrubC: Shrub = {}

const b = createBall(cW / 2 * 0.7, (cH / 2) + 100)
initBallControl(b)

const loops: Loopable<unknown>[] = [shrubA]
const sceneObjects: Presence[] = [b]

const draw = async (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, cW, cH)
    drawBackground(ctx)
    // drawShrub(ctx, (cW / 2) - 250, (cH / 2) - 60, shrubA)
    drawGrassBlades(ctx, cW / 2 - 30, cH / 2 - 10, cStraw, grassBladesA, sceneObjects)
    // drawShrub(ctx, (cW / 2) * 1.5, (cH / 2) - 19, shrubB)
    drawGrassBlades(ctx, cW / 2 + 20, cH / 2 - 5, cStrawLight, grassBladesB, sceneObjects)
    drawGrassBlades(ctx, cW / 2, cH / 2, cStraw, grassBladesC, sceneObjects)
    drawShrub(ctx, (cW / 2) - 80, (cH / 2) + 20, shrubC)

    const renders = animate(loops)
    renderAnims(ctx, renders)

    updateBall(b)
    drawBall(ctx, b)
    // drawGhost(ctx, cW / 2 + 100, cH / 2 + 60)
    animFrames(ctx, cW, cH)
    window.requestAnimationFrame(() => draw(ctx))
}

if (mainContext) draw(mainContext)

