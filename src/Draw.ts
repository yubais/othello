/* ボードをHTML上に描写、またクリックイベントを Board に送信 */

type color = "black" | "white"

export class Draw {
    ctx: CanvasRenderingContext2D
    width = 640
    height = 640
    w_grid = this.width / 8
    h_grid = this.height / 8
    
    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        canvas.width = this.width
        canvas.height = this.height
        if (ctx == null) {
            throw new Error('canvas context が取得できない')
        }
        this.ctx = ctx

        this.drawBlank(0,0)
        this.drawBlank(0,1)
    }

    drawBlank = (ix: number, iy: number) => {
        this.ctx.fillStyle = 'green'
        this.ctx.fillRect(ix*this.w_grid, iy*this.h_grid, this.w_grid-1, this.h_grid-1)
    }

    drawPiece = (ix: number, iy: number, color: color) => {
        this.drawBlank(ix, iy)
        this.ctx.fillStyle = color
        this.ctx.beginPath()
        this.ctx.arc(
            (ix + 0.5) * this.w_grid,
            (iy + 0.5) * this.h_grid,
            Math.min(this.w_grid, this.h_grid) * 0.35,
            0,
            2*Math.PI
        )
        this.ctx.fill()
    }
}