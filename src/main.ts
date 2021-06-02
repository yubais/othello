import { Board } from "./Board"
import { View } from "./View"
import { Controller } from "./Controller"

window.onload = () => {
    const pass = document.getElementById('pass') as HTMLAnchorElement
    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error("このブラウザには対応していません。")

    const humanColor = 'black'

    const board = new Board()
    const view = new View(canvas, board)
    const controller = new Controller(canvas, pass, board)
    
    const humansTurn = ():boolean => {
        return board.turn === 'black' // 暫定的にヒトは黒番で固定
    }

    canvas.onclick = (ev: MouseEvent) => {
        if (!humansTurn) return
        controller.click(ev)
        view.draw()
        // 対CPU戦ではここでCPUの思考が始まる
    }

    canvas.onmousemove = (ev: MouseEvent) => {
        if (!humansTurn) return
        controller.move(ev)
        view.draw()
    }

    canvas.onmouseout = (ev: MouseEvent) => {
        controller.mouseout(ev)
        view.draw()
    }
}
