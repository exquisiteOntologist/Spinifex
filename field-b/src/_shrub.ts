// shrub is a very small bush

import { RGB } from "./_types"
import { deviate } from "./_utils"

export const cShrubA: RGB = [33, 29, 16]
export const cShrubB: RGB = [43, 42, 25]
export const cShrubC: RGB = [55, 50, 32]
export const cShrubs: RGB[] = [cShrubA, cShrubB, cShrubC]


const rotStart = -90
const rotEnd = rotStart * -1
const numSteps = rotEnd - rotStart
const thickness = 6
const width = 120
const height = 60
const heightSag = 5

export interface ShrubLeaf {
    x: number,
    y: number,
    /** Height */
    h: number,
    /** Colour */
    c: string,
    /** Rotation (standing) */
    rot: number
}

export interface Shrub {
    leaves: ShrubLeaf[]
}

export const createShrub = (x: number, y: number): Shrub => {
    const leaves: ShrubLeaf[] = []

    for (let tI = 0; tI < thickness; tI++) {
        const offset = tI * 2
        const baseWidth = width - offset
        const baseHeight = height - ((height / thickness) * tI)
        const xStart = -(baseWidth / 2) - (offset / 2)
        
        let iP: number = 0
        for (let i = rotStart; i < rotEnd; i++) {
            const sC = cShrubs[(tI + iP) % (cShrubs.length - 1)]
            const sX = x + xStart + (baseWidth / numSteps * i) + deviate(1, 3, -3)
            // curveY is used to add to Height and also to say on the Y
            const curveI = (i < 0 ? i : -i)
            const curveY = heightSag / (numSteps / 2) * curveI - (curveI / numSteps)
            const sH = baseHeight - deviate(baseHeight / 4, 1.5, -1.5) + curveY

            const shrubLeaf: ShrubLeaf = {
                x: sX + 0.5,
                y: y + tI + curveY + 0.5,
                h: sH,
                c: `rgba(${sC.join(',')})`,
                rot: i
            }

            leaves.push(shrubLeaf)
            iP++
        }
    }

    return { leaves }
}


export const drawShrub = (ctx: CanvasRenderingContext2D, shrub: Shrub) => {
    shrub.leaves.forEach(leaf => {
        ctx.beginPath()
        ctx.strokeStyle = leaf.c
        ctx.lineWidth = 2
        ctx.shadowColor = leaf.c
        // ctx.shadowBlur = 4 // <- EXTREME PERFORMANCE IMPACT
        ctx.translate(leaf.x, leaf.y)
        ctx.moveTo(0, 0)
        ctx.rotate((leaf.rot + deviate(2, 2, 0)) / 180);
        ctx.lineTo(0, - leaf.h)
        ctx.stroke()
        ctx.closePath()
        ctx.resetTransform()
    })
}
