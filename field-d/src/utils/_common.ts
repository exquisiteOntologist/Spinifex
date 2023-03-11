// utilities like random number gen, flipping, & clamping

import { Pos, Presence } from "../_types"

/**
 * Multiply a number with a random value between 0.5 and 1.5.
 * The upper and lower thresholds can be set, for a narrower random.
 * The threshold must be between 0.5 or 1.5
 */
export const deviate = (num: number, up: number, low: number): number => {
    const ran = Math.random() // 0.0 to 1.0
    const multi = ran + 0.5 // 0.5 to 1.5
    const deviation = num * multi
    if (deviation > (num * up)) return deviate(num, up, low)
    if (deviation < (num * low)) return deviate(num, up, low)
    return deviation
}

/**
 * Randomly return a value between a high and a low
 */
export const randRum = (valHigh: number, valLow: number, round: boolean = true): number => {
    const ran = Math.random() // 0.0 to 1.0
    const spectrum = valHigh - valLow // difference between high & low
    const deviation = spectrum * ran // a lower value than spectrum (value * (0.0 to 1.0))
    const value = valLow + deviation // the lowest value plus the deviation
    if (round) return Math.round(value)
    return value
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
