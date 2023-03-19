import { Loopable, animate, renderAnims } from './utils/_anim'
import { printMetaFPS } from './utils/_debugging'
import { createBall, drawBall, initBallControl, updateBall } from './_ball'
import { drawBackground, drawBasicGround, drawSkyBackground } from './_landscape'
import { drawLetterbox } from './_overlays'
import { ShrubLoop } from './_shrub'
import { cStraw, cStrawLight, SpinifexLoop } from './_spinifex'
import { Presence } from './_types'

const mainCanvas = document.getElementById('mainCanvas') as HTMLCanvasElement
const cW = mainCanvas.width = window.innerWidth
const cH = mainCanvas.height = cW * 0.56
const cXc = cW / 2
const cYc = cH / 2
const mainContext = mainCanvas.getContext('2d')

const b = createBall(cW / 2 * 0.7, (cH / 2) + 100)
initBallControl(b)

const loops: Loopable<unknown>[] = []
const sceneObjects: Presence[] = [b]

const draw = async (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, cW, cH)
    drawBackground(ctx, 0, 0, cW, cH)
    drawSkyBackground(ctx, 0, 0, cW, cH * 0.6)
    drawBasicGround(ctx, -(cW * 0.2), cYc, cW * 1.5, cH * 0.75)

    const renders = animate(loops, sceneObjects)
    await renderAnims(ctx, renders)

    updateBall(b)
    drawBall(ctx, b)

    drawLetterbox(ctx)
    printMetaFPS(ctx, cW, cH)

    window.requestAnimationFrame(() => draw(ctx))
}

const initMain = () => {
    const spinifexA = new SpinifexLoop(1280, 180, 0, cYc * 0.9, cStraw, cW)
    const spinifexB = new SpinifexLoop(1000, 180, 0, cYc * 1.03, cStrawLight, cW)
    const spinifexC = new SpinifexLoop(800, 180, 0, cYc * 1.07, cStraw, cW)
    const spinifexD = new SpinifexLoop(1600, 180, 0, cYc * 0.95, cStraw, cW)
    const shrubA = new ShrubLoop(150, 128, cXc * 1.5, cYc * 1.2)
    const shrubB = new ShrubLoop(150, 128, cXc * 0.9, cYc * 1.03)
    const shrubC = new ShrubLoop(150, 128, cXc * 0.7, cYc * 0.88)

    loops.push(spinifexA, spinifexB, spinifexC, spinifexD, shrubA, shrubB, shrubC)
    loops.sort((a, b) => a.y - b.y)
}

if (mainContext) {
    initMain()
    draw(mainContext)
}

