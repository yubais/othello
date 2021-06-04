/* 盤面の描写 */

import { Board } from './Board'

type Color = "black" | "white"

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
    oppo = (color: Color): Color => {
        return (color === 'black') ? 'white' : 'black'
    }

    draw = () => {
        for (let ix=0; ix<this.board.width; ix++) {
            for (let iy=0; iy<this.board.height; iy++) {    
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

        for(let ix=2; ix<this.board.width; ix+=4) {
            for(let iy=2; iy<this.board.width; iy+=4) {
                this.drawStar(ix, iy)
            }
        }
    }

    drawBlank = (ix: number, iy: number) => {
        this.ctx.fillStyle = 'green'
        this.ctx.fillRect(ix*this.w_grid+1, iy*this.h_grid+1, this.w_grid-2, this.h_grid-2)
    }

    drawStar = (ix: number, iy: number) => {
        // 指定したマスの左上に黒いぽちをつける
        this.ctx.fillStyle = '#223344'
        this.ctx.beginPath()
        this.ctx.arc(
            ix * this.w_grid,
            iy * this.h_grid,
            Math.min(this.w_grid, this.h_grid) * 0.05,
            0,
            2*Math.PI
        )
        this.ctx.fill()
    }
    
    drawSelected = (ix: number, iy: number) => {
        this.drawBlank(ix, iy)

        this.ctx.globalAlpha = 0.25
        this.ctx.fillStyle = this.board.turn

        this.ctx.beginPath()

        this.ctx.arc(
            (ix + 0.5) * this.w_grid,
            (iy + 0.5) * this.h_grid,
            Math.min(this.w_grid, this.h_grid) * 0.35,
            0,
            2*Math.PI
        )
        this.ctx.fill()

        this.ctx.globalAlpha = 1
    }

    drawPiece = (ix: number, iy: number, color: Color) => {
        this.drawBlank(ix, iy)
        
        this.ctx.fillStyle = this.oppo(color)
        this.ctx.globalAlpha = 0.5
        this.ctx.beginPath()
        this.ctx.arc(
            (ix + 0.5) * this.w_grid,
            (iy + 0.5) * this.h_grid + 1,
            Math.min(this.w_grid, this.h_grid) * 0.35,
            0,
            2*Math.PI
        )
        this.ctx.fill()

        this.ctx.fillStyle = color
        this.ctx.globalAlpha = 1
        this.ctx.beginPath()
        this.ctx.arc(
            (ix + 0.5) * this.w_grid,
            (iy + 0.5) * this.h_grid - 1,
            Math.min(this.w_grid, this.h_grid) * 0.35,
            0,
            2*Math.PI
        )
        this.ctx.fill()
    }
}