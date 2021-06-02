import { Board } from "./Board"

export class Controller {
    canvas: HTMLCanvasElement
    passElement: HTMLAnchorElement
    board: Board

    constructor(canvas: HTMLCanvasElement, pass: HTMLAnchorElement, board: Board) {
        this.canvas = canvas
        this.canvas.onclick = this.click
        this.canvas.onmousemove = this.move
        this.canvas.onmouseout = this.mouseout
        this.board = board
        this.passElement = pass
        this.passElement.onclick = this.pass
    }

    click = (ev: MouseEvent) => {
        const pos = this.getInnerPosition(ev)
        if (this.board.isPlaceable(pos)) {
            this.board.place(pos)
        } else {
            // 「置けない」のフィードバックは必要か？
        }
    }

    move = (ev: MouseEvent) => {
        this.board.selected = this.getInnerPosition(ev)
    }

    mouseout = () => {
        this.board.selected = [-1, -1]
    }

    pass = (ev: MouseEvent) => {
        this.board.pass()
    }

    getInnerPosition = (ev: MouseEvent): [number, number] => {
        const ix = Math.floor(ev.clientX / this.canvas.width  * this.board.width)
        const iy = Math.floor(ev.clientY / this.canvas.height * this.board.height)
        return [ix, iy]
    }
}
