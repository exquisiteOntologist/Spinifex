

// export interface AnimCanvas {
//     ctx: CanvasRenderingContext2D,
//     canvas: HTMLCanvasElement
// }

/** Create a canvas at width and height and return context. Context has Canvas property. */
export const createCanvas = (width: number, height: number): CanvasRenderingContext2D => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = width
    canvas.height = height
    canvas.style.display = 'hidden'

    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.fillStyle = 'rgba(0,0,0,0)'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    return ctx
}
