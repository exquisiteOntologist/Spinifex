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

export interface Loopable<AnimType, FrameState = AnimType> {
    /** Don't render when dead */
    alive: boolean
    /** Current angle we are rendering */
    angle: number
    /** Parent rendering context */
    pCtx?: CanvasRenderingContext2D
    /** Canvas rendering context */
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
    render: () => LoopOut<AnimType, FrameState>
    /** Call to perform actual drawing */
    draw: (degree: number) => void
    /** Initialize properties */
    init: () => void
}


export const animate = (lArray: Loopable<unknown>[]): LoopOut<unknown, unknown>[] => lArray.map(l => l.render())

export const renderAnims = async (ctx: CanvasRenderingContext2D, rArray: LoopOut<unknown, unknown>[]) => await Promise.all(rArray.map(async r => {
    const bitmap = await createImageBitmap(r.imageData)
    ctx.drawImage(bitmap, 0, 0)

    // putImageData doesn't respect transparent pixels
    // ctx.putImageData(r.imageData, 0, 0)
}))


