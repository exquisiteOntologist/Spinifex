import { Loopable, animate, renderAnims } from './utils/_anim'
import { animFrames } from './utils/_debugging'
import { createBall, drawBall, initBallControl, updateBall } from './_ball'
// import { drawGhost } from './_ghosts'
import { Shrub, ShrubLoop } from './_shrub'
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

const b = createBall(cW / 2 * 0.7, (cH / 2) + 100)
initBallControl(b)

const loops: Loopable<unknown>[] = []
const sceneObjects: Presence[] = [b]

const draw = async (ctx: CanvasRenderingContext2D) => {
    // await new Promise(r => setTimeout(() => {
    //     r(1)
    // }, 3000))

    ctx.clearRect(0, 0, cW, cH)
    drawBackground(ctx)

    drawGrassBlades(ctx, cW / 2 - 30, cH / 2 - 10, cStraw, grassBladesA, sceneObjects)
    drawGrassBlades(ctx, cW / 2 + 20, cH / 2 - 5, cStrawLight, grassBladesB, sceneObjects)
    drawGrassBlades(ctx, cW / 2, cH / 2, cStraw, grassBladesC, sceneObjects)

    const renders = animate(loops)
    renderAnims(ctx, renders)

    updateBall(b)
    drawBall(ctx, b)
    // drawGhost(ctx, cW / 2 + 100, cH / 2 + 60)
    animFrames(ctx, cW, cH)

    window.requestAnimationFrame(() => draw(ctx))
}

const initMain = () => {
    const shrubA = new ShrubLoop(300, 128, (cW / 2) * 1.5, (cH / 2) * 0.95)
    const shrubB = new ShrubLoop(300, 128, (cW / 2) * 0.9, (cH / 2) * 1.1)
    const shrubC = new ShrubLoop(300, 128, (cW / 2) * 0.7, (cH / 2) * 0.9)

    loops.push(shrubA, shrubB, shrubC)
}

if (mainContext) {
    initMain()
    draw(mainContext)
}

