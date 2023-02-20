// the ball moves through grass and displaces it

interface Ball {
    x: number,
    y: number,
    speed: number,
    direction: number,
    xSpeed: number,
    ySpeed: number
}

export const createBall = (x: number, y: number) => {
    const b: Ball = {
        x,
        y,
        speed: 0,
        direction: 0,
        xSpeed: 0,
        ySpeed: 0
    }

    return b
}

const bDrag: number = 0.1
export const dragBall = (b: Ball) => {
    if (!b.xSpeed && !b.ySpeed && !b.speed) return
    
    if (b.xSpeed > 0) b.xSpeed -= Math.min(bDrag, b.xSpeed)
    else if (b.xSpeed < 0) b.xSpeed += Math.min(bDrag, -b.xSpeed)
    
    if (b.ySpeed > 0) b.ySpeed -= Math.min(bDrag, b.ySpeed)
    else if (b.ySpeed < 0) b.ySpeed += Math.min(bDrag, -b.ySpeed)

    if (b.speed > 0) b.speed -= Math.min(1, bDrag)
    else if (b.speed < 0) b.speed += Math.min(1, -bDrag)
}

export const moveBall = (b: Ball) => {
    b.x += b.xSpeed
    b.y += b.ySpeed
}

const bVelocity: number = 2
const bSpeedLimit: number = 3
export const controlBall = (e: KeyboardEvent, b: Ball) => {
    switch (e.key) {
        case 'w':
            b.ySpeed -= bVelocity
            break
        case 's':
            b.ySpeed += bVelocity
            break
        case 'a':
            b.xSpeed -= bVelocity
            break
        case 'd':
            b.xSpeed += bVelocity
            break
        default:
            break;
    }

    if (b.xSpeed >= bSpeedLimit) b.xSpeed = bSpeedLimit
    else if (b.xSpeed <= 0-bSpeedLimit) b.xSpeed = -bSpeedLimit
    
    if (b.ySpeed >= bSpeedLimit) b.ySpeed = bSpeedLimit
    else if (b.ySpeed <= 0-bSpeedLimit) b.ySpeed = -bSpeedLimit
    
    if (b.speed >= bSpeedLimit) b.speed = bSpeedLimit
}

export const updateBall = (b: Ball) => {
    dragBall(b)
    moveBall(b)
    console.log('updated ball', b)
}

export const initBallControl = (b: Ball) => window.addEventListener('keydown', (e) => controlBall(e, b))

export const drawBall = (ctx: CanvasRenderingContext2D, b: Ball) => {
    // ctx.moveTo(x, y)
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    // ctx.ellipse(0, 0, 32, 32, Math.PI / 4, 0, 0, false)
    ctx.ellipse(b.x, b.y, 32, 32, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill()
    ctx.closePath()
}
