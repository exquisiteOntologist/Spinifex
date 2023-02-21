/** The positions of the sides of a thing (2D box) */
export interface Pos {
    xL: number,
    xR: number,
    zT: number,
    zB: number
}

export interface XY {
    x: number,
    y: number
}

export interface Size {
    width: number,
    height?: number
}

export interface Presence extends XY, Size {}

export type RGB = [number, number, number]


