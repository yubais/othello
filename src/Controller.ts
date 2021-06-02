import { Board } from "./Board"

export class Controller {
    canvas: HTMLCanvasElement
    board: Board
    player = 'black'

    constructor(canvas: HTMLCanvasElement, board: Board) {
        this.canvas = canvas
        this.board = board
    }

    click = (ev: MouseEvent) => {
        // if (this.player !== this.board.turn) return
        const pos = this.getInnerPosition(ev)
        if (this.board.isPlaceable(pos)) {
            this.board.place(pos)
        } else {
            // 「置けない」のフィードバックは必要か？
        }
    }

    move = (ev: MouseEvent) => {
        // if (this.player !== this.board.turn) return
        this.board.selected = this.getInnerPosition(ev)
    }

    mouseout = (ev: MouseEvent) => {
        this.board.selected = [-1, -1]
    }

    getInnerPosition = (ev: MouseEvent): [number, number] => {
        const client = this.canvas.getClientRects()[0]
        const ix = Math.floor((ev.clientX - client.left) / client.width  * this.board.width)
        const iy = Math.floor((ev.clientY - client.top) / client.height * this.board.height)
        return [ix, iy]
    }
}
