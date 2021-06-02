/* ボードをHTML上に描写、またクリックイベントを Board に送信 */

import { Board } from './Board'

type color = "black" | "white"

export class View {
    ctx: CanvasRenderingContext2D
    board: Board
    width = 640
    height = 640
    w_grid: number
    h_grid: number
    
    constructor(canvas: HTMLCanvasElement, board: Board) {
        const ctx = canvas.getContext('2d')
        canvas.width = this.width
        canvas.height = this.height
        this.w_grid = this.width / board.width
        this.h_grid = this.height / board.height
        if (ctx == null) {
            throw new Error('canvas context が取得できない')
        }
        this.ctx = ctx
        this.board = board
        this.draw()
    }

    draw = () => {
        // this.ctx.clearRect(0, 0, this.width, this.height)

        for (let ix=0; ix<this.board.width; ix++) {
            for (let iy=0; iy<this.board.width; iy++) {    
                const state = this.board.getState([ix, iy])
                if (state === 'empty') {
                    if (this.board.selected[0] == ix && this.board.selected[1] == iy) {
                        this.drawSelected(ix, iy)
                    } else {
                        this.drawBlank(ix, iy)
                    }
                }
                if (state === 'black') this.drawPiece(ix, iy, 'black')
                if (state === 'white') this.drawPiece(ix, iy, 'white')
            }
        }
    }

    drawBlank = (ix: number, iy: number) => {
        this.ctx.fillStyle = 'green'
        this.ctx.fillRect(ix*this.w_grid+1, iy*this.h_grid+1, this.w_grid-2, this.h_grid-2)
    }
    
    drawSelected = (ix: number, iy: number) => {
        this.ctx.globalAlpha = 0.25
        this.drawPiece(ix, iy, this.board.turn)
        this.ctx.globalAlpha = 1
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