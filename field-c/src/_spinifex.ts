// The grass

import { Presence, RGB } from './_types'
import { deviate, flip, maxMin, pos } from './utils/_common'
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
    lW: number,
    /** Rotation */
    rot: number
    /** When trampled, trample to the left? */
    trampleLeft: boolean
}

export interface Spinifex {
    blades: GrassBlade[]
}

export const drawGrassBlade = (ctx: CanvasRenderingContext2D, b: GrassBlade, objects: Presence[]) => {
    updateGrassBlade(b, objects)
    
    ctx.beginPath()
    ctx.strokeStyle = b.c
    ctx.lineWidth = b.lW
    ctx.translate(b.x, b.y)
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

export const updateGrassBlade = (b: GrassBlade, objects: Presence[]) => {
    const shift = deviate(0.5, 1, -1) * flip()
    b.x1 = maxMin(b.x1 + shift, 10, 0 - 10)
    b.x2 = maxMin(b.x2 + shift, 50, 0 - 50)

    const beingTrampled = objects.map(pos).some(o => b.x > o.xL && b.x < o.xR && b.y > o.zT && b.y < o.zB)

    if (beingTrampled) {
        b.rot = b.trampleLeft ? rotGrassDownLeft : rotGrassDownRight
    } else {
        b.rot = rotGrassUp
    }
}

const aliasAdjust = 0.5
export const createGrassBlade = (x: number, y: number, rgbBase: RGB = cWhite): GrassBlade => {
    const dX: number = deviate(x, 1.5, 0.5)
    const dY: number = y + (deviate(1, 1, 0) * flip())
    const xF = flip()
    const h = deviate(120, 2, 0.3)
    const rgbDev = (deviate(5, 1, -1) * flip())
    const alpha = 0.5 + deviate(0.25, 1.5, 0.5)

    const b: GrassBlade = {
        xF,
        h,
        x: dX + aliasAdjust,
        y: dY + aliasAdjust,
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

export const createGrassBlades = (x: number, y: number, rgb: RGB, blades: GrassBlade[]): GrassBlade[] => {
    if (blades.length <= numBlades) {
        for (let i = 0; i < numBlades; i++) {
            blades.push(createGrassBlade(x, y, rgb))
        }
    }

    return blades
}

export const drawGrassBlades = (ctx: CanvasRenderingContext2D, x: number, y: number, rgb: RGB, blades: GrassBlade[], objects: Presence[]) => {
    const grassBlades = createGrassBlades(x, y, rgb, blades)

    // ctx.translate(0.5, 0.5)

    for (let i = 0; i < numBlades; i++) {
        drawGrassBlade(ctx, grassBlades[i], objects)
    }

    // ctx.translate(0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export const createSpinifex = (x: number, y: number, rgb: RGB): Spinifex => {
    const spinifex: Spinifex = {
        blades: createGrassBlades(x, y, rgb, [])
    }

    return spinifex
}

export const drawSpinifex = (ctx: CanvasRenderingContext2D, x: number, y: number, instance: Spinifex, rgb: RGB) => {
    drawGrassBlades(ctx, x, y, rgb, instance.blades, [])
}

export class SpinifexLoop implements Loopable<Spinifex> {
    x: number
    y: number
    alive = true
    angle = 0
    ctx: CanvasRenderingContext2D
    instance: Spinifex = { blades: [] }
    reverseLoop = false
    rendered: FramesAngles<Spinifex> = { rFrames: { 0: [] }, rState: { 0: [] } }
    targetFrames = 30 // 180
    frame = 0
    renderPass = 0

    rgb!: RGB

    render = (): LoopOut<Spinifex, Spinifex> => {
        this.draw()
        const renderFrame = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

        this.renderPass++

        return { loopable: this, imageData: renderFrame }
    }

    draw = () => drawSpinifex(this.ctx, this.x, this.y, this.instance, this.rgb)
    
    init = () => this.instance = createSpinifex(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, this.rgb)

    constructor(width: number, height: number, x: number, y: number, rgb: RGB) {
        this.ctx = createCanvas(width, height)
        this.x = x,
        this.y = y
        this.rgb = rgb

        this.init()
    }
}
