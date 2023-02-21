// The grass

import { Presence, RGB } from './_types'
import { deviate, flip, maxMin, pos } from './_utils'

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

const rotGrassDown = -1 * deviate(70, 1.5, -1.5)
const rotGrassUp = -1 * deviate(30, 1.5, -1.5)

export const updateGrassBlade = (b: GrassBlade, objects: Presence[]) => {
    const shift = deviate(0.5, 1, -1) * flip()
    b.x1 = maxMin(b.x1 + shift, 10, 0 - 10)
    b.x2 = maxMin(b.x2 + shift, 50, 0 - 50)

    if (objects.map(pos).some(o => b.x > o.xL && b.x < o.xR && b.y > o.zT && b.y < o.zB)) {
        b.rot = rotGrassDown
    } else {
        b.rot = rotGrassUp
    }
}

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
        x: dX,
        y: dY,
        x1: 0 + (5 * xF),
        x2: 0 + (35 * xF),
        y1: 0 - (h/2),
        y2: 0 - h,
        rad: deviate(30, 1.5, 0.5),
        c: `rgba(${rgbBase[0] + rgbDev}, ${rgbBase[1] + rgbDev}, ${rgbBase[2] + rgbDev}, ${alpha})`,
        lW: 1,
        rot: rotGrassUp
    }

    return b
}



export const drawGrassBlades = (ctx: CanvasRenderingContext2D, x: number, y: number, rgb: RGB, grassBlades: GrassBlade[], objects: Presence[]) => {
    if (grassBlades.length <= numBlades) {
        for (let i = 0; i < numBlades; i++) {
            grassBlades.push(createGrassBlade(x, y, rgb))
        }
    }

    ctx.translate(0.5, 0.5)

    for (let i = 0; i < numBlades; i++) {
        drawGrassBlade(ctx, grassBlades[i], objects)
    }

    ctx.translate(0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

