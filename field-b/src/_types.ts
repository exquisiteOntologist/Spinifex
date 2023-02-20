export interface XY {
    x: number,
    y: number
}

export interface Size {
    width: number,
    height?: number
}

export interface Presence extends XY, Size {}
