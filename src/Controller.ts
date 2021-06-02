import { Board } from "./Board"

export class Controller {
    canvas: HTMLCanvasElement
    board: Board

    constructor(canvas: HTMLCanvasElement, board: Board) {
        canvas.onclick = this.getInnerPosition
        this.canvas = canvas
        this.board = board
    }

    getInnerPosition = (ev: MouseEvent) => {
        const ix = Math.floor(ev.clientX / this.canvas.width  * this.board.width)
        const iy = Math.floor(ev.clientY / this.canvas.height * this.board.height)
        console.log(ix, iy)
    }
}
