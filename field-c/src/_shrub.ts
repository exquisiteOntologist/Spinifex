// shrub is a very small bush

import { RGB } from "./_types"
import { FramesAngles, Loopable, LoopOut } from "./utils/_anim"
import { createCanvas } from "./utils/_canvas"
import { deviate, flip } from "./utils/_common"

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
    leaves?: ShrubLeaf[]
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

export const drawShrub = (ctx: CanvasRenderingContext2D, x: number, y: number, shrub: Shrub) => {
    if (!shrub.leaves?.length) Object.assign(shrub, createShrub(x, y)) // <- class version doesn't need this

    shrub.leaves?.forEach((leaf, i) => {
        ctx.beginPath()
        ctx.strokeStyle = leaf.c
        ctx.lineWidth = 2
        ctx.shadowColor = leaf.c
        ctx.shadowBlur = 1 // <- EXTREME PERFORMANCE IMPACT ! ! !
        ctx.translate(leaf.x, leaf.y)
        ctx.moveTo(0, 0)
        ctx.rotate((leaf.rot + deviate(2, 2, 0)) / 180);
        ctx.lineTo(0, - leaf.h)
        ctx.stroke()
        ctx.closePath()
        ctx.resetTransform()
    })
}

export class ShrubLoop implements Loopable<Shrub> {
    x: number
    y: number
    alive = true
    angle = 0
    ctx: CanvasRenderingContext2D
    instance = {}
    reverseLoop = false
    rendered: FramesAngles<Shrub> = { rFrames: { 0: [] }, rState: { 0: [] } }
    targetFrames = 180 // 180
    frame = 0
    renderPass = 0

    render = (): LoopOut<Shrub, Shrub> => {
        let renderedFrames = this.rendered.rFrames[this.angle]
        if (!renderedFrames) renderedFrames = this.rendered.rFrames[this.angle] = []

        if (this.frame === 0 && renderedFrames.length) {
            // const brokenFrame = {...renderedFrames[0]}
            // console.log('broken frame', brokenFrame)
            // renderedFrames.splice(0, 1, renderedFrames[renderedFrames.length - 1]) // first frame is shit
            renderedFrames.splice(0, 1) // first frame is shit
            // this.frame = 1
        }


        const frameAlreadyRendered = this.frame < renderedFrames.length
        const framesBelowTarget = renderedFrames.length <= this.targetFrames
        if (!frameAlreadyRendered && framesBelowTarget) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            this.draw()
            renderedFrames.push(this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height))
        }
        
        // const renderedFrame = renderedFrames[Math.min(Math.round(Math.random() * 10), renderedFrames.length - 1)]
        // const frameIndex = (renderedFrames.length > 1 && flip() === 1) ? 2: 0
        // const renderedFrame = renderedFrames[frameIndex]
        const renderedFrame = renderedFrames[this.frame]

        if (!renderedFrame) console.error('no rendered frame', this.frame, renderedFrames)

        const isLastFrame = this.frame === (renderedFrames.length - 1)
        if (this.reverseLoop && isLastFrame) renderedFrames.reverse()

        this.frame = (this.frame + 1) % this.targetFrames
        this.renderPass++

        // console.log('rendered frame', this.targetFrames, renderedFrames, this.frame, /* pFrame, frameIndex, */ renderedFrame)

        return { loopable: this, imageData: renderedFrame }
    }
    
    draw = () => drawShrub(this.ctx, this.x, this.y, this.instance)
    
    init = () => this.instance = createShrub(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2)

    constructor(width: number, height: number, x: number, y: number) {
        this.ctx = createCanvas(width, height)
        this.x = x,
        this.y = y

        this.init()
    }
}
