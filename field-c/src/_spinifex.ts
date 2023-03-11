// The grass

import { Presence, RGB } from './_types'
import { deviate, flip, maxMin, pos, randRum } from './utils/_common'
import { FramesAngles, Loopable, LoopOut } from './utils/_anim'
import { createCanvas } from './utils/_canvas'

export const cWhite: RGB = [250, 250, 250]
export const cStraw: RGB = [123, 102, 78]
export const cStrawLight: RGB = [114, 95, 71]
const numBlades = 600

export interface GrassBlade {
    /** Direction multiplier (-1 OR 1) */
    xF: -1 | 1,
    /** Height */
    h: number,
    /** X on Spinifex's canvas */
    cX: number,
    /** Y on Spinifex's canvas */
    cY: number,
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
    lW: number,
    /** Rotation */
    rot: number
    /** When trampled, trample to the left? */
    trampleLeft: boolean
}

export interface Spinifex {
    x: number,
    y: number,
    blades: GrassBlade[]
}

export const drawGrassBlade = (ctx: CanvasRenderingContext2D, b: GrassBlade, instance: Spinifex, objects: Presence[]) => {
    updateGrassBlade(b, instance, objects)
    
    ctx.beginPath()
    ctx.strokeStyle = b.c
    ctx.lineWidth = b.lW
    ctx.translate(b.cX, b.cY)
    ctx.moveTo(0, 0)
    ctx.rotate((b.rot * Math.PI) / 180);
    ctx.arcTo(b.x1, b.y1, b.x2, b.y2, b.rad)
    ctx.stroke()
    ctx.closePath()
    ctx.resetTransform()
}

const rotGrassDownLeft = -1 * deviate(60, 1.5, -1.5)
const rotGrassDownRight = -1 * deviate(40, 1.5, -1.5)
const rotGrassUp = -1 * deviate(30, 1.5, -1.5)

export const updateGrassBlade = (b: GrassBlade, spin: Spinifex, objects: Presence[]) => {
    const shift = deviate(0.5, 1, -1) * flip()
    b.x1 = maxMin(b.x1 + shift, 10, 0 - 10)
    b.x2 = maxMin(b.x2 + shift, 50, 0 - 50)

    // TODO: Handle trampling with (b.x + b.cX) > o.xL etc
    // note x point on main canvas is x - own canvas half width
    const beingTrampled = objects.map(pos).some(o => (spin.x + b.cX) > o.xL && (spin.y + b.cX) < o.xR && (spin.x + b.cY) > o.zT && (spin.y + b.cY) < o.zB)

    if (beingTrampled) {
        b.rot = b.trampleLeft ? rotGrassDownLeft : rotGrassDownRight
    } else {
        b.rot = rotGrassUp
    }
}

const aliasAdjust = 0.5
export const createGrassBlade = (xLow: number, xHigh: number, x: number, y: number, rgbBase: RGB = cWhite): GrassBlade => {
    // const dX: number = deviate(x, 1.5, 0.5)
    const dX: number = randRum(xHigh, xLow)
    const dY: number = y + (deviate(1, 1, 0) * flip())
    const xF = flip()
    const h = deviate(120, 2, 0.3)
    const rgbDev = (deviate(5, 1, -1) * flip())
    const alpha = 0.5 + deviate(0.25, 1.5, 0.5)

    const b: GrassBlade = {
        xF,
        h,
        cX: dX + aliasAdjust,
        cY: dY + aliasAdjust,
        x1: 0 + (5 * xF),
        x2: 0 + (35 * xF),
        y1: 0 - (h/2),
        y2: 0 - h,
        rad: deviate(30, 1.5, 0.5),
        c: `rgba(${rgbBase[0] + rgbDev}, ${rgbBase[1] + rgbDev}, ${rgbBase[2] + rgbDev}, ${alpha})`,
        lW: 1,
        rot: rotGrassUp,
        trampleLeft: flip() === 1
    }

    return b
}

export const createGrassBlades = (cX: number, cY: number, width: number, rgb: RGB, blades: GrassBlade[]): GrassBlade[] => {
    const xLow = cX + (width * 0.1)
    const xHigh = cX + width * 0.9
    if (blades.length <= numBlades) {
        for (let i = 0; i < numBlades; i++) {
            blades.push(createGrassBlade(xLow, xHigh, cX, cY, rgb))
        }
    }

    return blades
}

export const drawGrassBlades = (ctx: CanvasRenderingContext2D, cX: number, cY: number, rgb: RGB, instance: Spinifex, objects: Presence[]) => {
    const width = ctx.canvas.width
    const grassBlades = createGrassBlades(cX, cY, width, rgb, instance.blades)

    for (let i = 0; i < numBlades; i++) {
        drawGrassBlade(ctx, grassBlades[i], instance, objects)
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export const createSpinifex = (x: number, y: number, cX: number, cY: number, width: number, rgb: RGB): Spinifex => {
    const spinifex: Spinifex = {
        x,
        y,
        blades: createGrassBlades(cX, cY, width, rgb, [])
    }

    return spinifex
}

export const drawSpinifex = (ctx: CanvasRenderingContext2D, cX: number, cY: number, instance: Spinifex, rgb: RGB, sceneObjects: Presence[]) => {
    drawGrassBlades(ctx, cX, cY, rgb, instance, sceneObjects)
}

export class SpinifexLoop implements Loopable<Spinifex> {
    cX: number
    cY: number
    x: number
    y: number
    alive = true
    angle = 0
    ctx: CanvasRenderingContext2D
    instance: Spinifex = { x: 0, y: 0, blades: [] }
    reverseLoop = false
    rendered: FramesAngles<Spinifex> = { rFrames: { 0: [] }, rState: { 0: [] } }
    targetFrames = 30 // 180
    frame = 0
    renderPass = 0

    rgb!: RGB

    get width() {
        return this.ctx.canvas.width
    }

    render = (sceneObjects?: Presence[]): LoopOut<Spinifex, Spinifex> => {
        this.ctx.clearRect(0, 0, this.width, this.ctx.canvas.height)
        this.draw(0, sceneObjects)
        const renderedFrame = this.ctx.getImageData(0, 0, this.width, this.ctx.canvas.height)

        // let renderedFrames = this.rendered.rFrames[this.angle]
        // if (!renderedFrames) renderedFrames = this.rendered.rFrames[this.angle] = []

        // const frameAlreadyRendered = this.frame < renderedFrames.length
        // const framesBelowTarget = renderedFrames.length <= this.targetFrames
        // if (!frameAlreadyRendered && framesBelowTarget) {
        //     this.ctx.clearRect(0, 0, this.width, this.ctx.canvas.height)
        //     this.draw()
        //     renderedFrames.push(this.ctx.getImageData(0, 0, this.width, this.ctx.canvas.height))
        // }

        // const renderedFrame = renderedFrames[this.frame]

        // if (!renderedFrame) console.error('no rendered frame', this.frame, renderedFrames)

        // const isLastFrame = this.frame === (renderedFrames.length - 1)
        // if (this.reverseLoop && isLastFrame) renderedFrames.reverse()

        // this.frame = (this.frame + 1) % this.targetFrames
        this.renderPass++

        // // if (this.renderPass === 1) {
        // //     console.log('frames', this.rendered.rFrames[this.angle], this)
        // // }

        return { loopable: this, imageData: renderedFrame }
    }

    draw = (angle: number = 0, sceneObjects: Presence[] = []) => drawSpinifex(this.ctx, this.cX, this.cY, this.instance, this.rgb, sceneObjects)
    
    init = () => this.instance = createSpinifex(this.x, this.y, this.cX, this.cY, this.width, this.rgb)

    constructor(width: number, height: number, x: number, y: number, rgb: RGB) {
        this.ctx = createCanvas(width, height)
        this.x = x,
        this.y = y
        this.cX = 0
        this.cY = this.ctx.canvas.height / 2
        this.rgb = rgb

        this.init()
    }
}
