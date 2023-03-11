import { Presence, XY } from "../_types";

export type RenderedFrame = ImageData
export type DegreeKey = number;

/** Store previously rendered frames & state. Best for passive object state. */
export interface FramesAngles<FrameState = {}> {
    /** Frames for each degree. Each key is a degree. */
    rFrames: { [key: number]: RenderedFrame[] }
    /** State of each frame of each degree. */
    rState: { [key: number]: FrameState[] }
}

/** Since Loopables draw to their own canvas, the renderings may be used by another. */
export interface LoopOut<AnimType, FrameState> {
    loopable: Loopable<AnimType, FrameState>
    imageData: ImageData
}

export interface Loopable<AnimType, FrameState = AnimType> extends XY {
    /** Don't render when dead */
    alive: boolean
    /** Current angle we are rendering */
    angle: number
    /** Parent rendering context */
    pCtx?: CanvasRenderingContext2D
    /** Own canvas rendering context */
    ctx: CanvasRenderingContext2D
    instance: AnimType
    /** Previously rendered frames. Use to avoid waste. */
    rendered: FramesAngles<FrameState>
    /** Number of frames to draw. May want to also use with easings. */
    targetFrames: number
    /** The current frame number */
    frame: number
    /** Reverse the frames when reaching the last frame? */
    reverseLoop?: boolean,
    /** Called by an external animator */
    render: (sceneObjects?: Presence[]) => LoopOut<AnimType, FrameState>
    /** Call to perform actual drawing */
    draw: (degree: number, sceneObjects: Presence[]) => void
    /** Initialize properties */
    init: () => void
}


export const animate = (lArray: Loopable<unknown>[], sceneObjects?: Presence[]): LoopOut<unknown, unknown>[] => lArray.map(l => l.render(sceneObjects))

/**
 * Draw an array of renders.
 * Despite being async, must synchronously draw each render, otherwise the layering will be based on execution speed.
 */
export const renderAnims = async (ctx: CanvasRenderingContext2D, rArray: LoopOut<unknown, unknown>[], markCorners: boolean = true) => await new Promise((resolve, reject) => {
    // by doing reduce it makes the async functions more synchronous, to preserve layer order
    // https://stackoverflow.com/a/48512613
    rArray.reduce(
        (p, r) => p.then(() => renderAnim(ctx, r, markCorners)),
        Promise.resolve()).then(() => resolve(true)).catch(() => reject(false)
    );
})

const renderAnim = async (ctx: CanvasRenderingContext2D, r: LoopOut<unknown, unknown>, markCorners: boolean = true) => {
    const bitmap = await createImageBitmap(r.imageData)
    const xLeft = r.loopable.x - (bitmap.width / 2)
    const xRight = xLeft + bitmap.width
    const yTop = r.loopable.y - (bitmap.height / 2)
    const yBottom = yTop + bitmap.height
    // draw so image's bottom-center is approx X and Y
    ctx.drawImage(bitmap, xLeft, yTop + (bitmap.height / 2))

    if (markCorners) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.resetTransform()
        ctx.fillStyle = 'yellow'
        // top left
        ctx.fillRect(xLeft, r.loopable.y, 1, 1)
        // top right
        ctx.fillRect(xRight - 1, r.loopable.y, 1, 1)
        // bottom left
        ctx.fillRect(xLeft, yBottom - 1, 1, 1)
        // bottom right
        ctx.fillRect(xRight - 1, yBottom - 1, 1, 1)
    }
}

// export const oldRenderAnims = async (ctx: CanvasRenderingContext2D, rArray: LoopOut<unknown, unknown>[], markCorners: boolean = true) => Promise.all(rArray.map(r => renderAnim(ctx, r, markCorners)))

