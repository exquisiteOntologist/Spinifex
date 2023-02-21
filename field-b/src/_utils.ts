// utilities like random number gen, flipping, & clamping

import { Pos, Presence } from "./_types"

export const deviate = (num: number, up: number, low: number): number => {
    const ran = Math.random() // 0.0 to 1.0
    const multi = ran + 0.5 // 0.5 to 1.5
    const deviation = num * multi
    if (deviation > (num * up)) return deviate(num, up, low)
    if (deviation < (num * low)) return deviate(num, up, low)
    return deviation
}

export const maxMin = (num: number, max: number, min: number): number => {
    const numUp = Math.min(num, max) // no more than top
    const numLow = Math.max(numUp, min) // no less than bottom
    return numLow
}

export const flip = (): -1 | 1 => Math.random() > 0.5 ? 1 : -1

export const pos = (o: Presence): Pos => {
    const halfWidth = o.width / 2
    const xL = o.x - halfWidth
    const xR = o.x + halfWidth
    const zT = o.y - halfWidth
    const zB = o.y + halfWidth
    
    return { xL, xR, zT, zB }
}
