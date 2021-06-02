import { Board } from "./Board"
import { View } from "./View"
import { Controller } from "./Controller"
import { Logic } from "./Logic"

window.onload = () => {
    const pass = document.getElementById('pass') as HTMLAnchorElement
    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error("このブラウザには対応していません。")

    const humanColor = 'black'

    const board = new Board()
    const view = new View(canvas, board)
    const controller = new Controller(canvas, board)
    const logic = new Logic(2)
    
    const isHumansTurn = ():boolean => {
        return board.turn === 'black' // 暫定的にヒトは黒番で固定
    }

    const cpusTurn = () => {
        // わざと一瞬止まる
        setTimeout( () => {
            const cpuChoice = logic.next(board)
            if (cpuChoice === undefined) {
                board.pass()
            } else {
                board.place( cpuChoice )
            }
            view.draw()
            }, 150)
        }

    canvas.onclick = (ev: MouseEvent) => {
        if (!isHumansTurn()) return
        controller.click(ev)
        view.draw()
        // 対CPU戦ではここでCPUの思考が始まる
        if (isHumansTurn()) return
        cpusTurn()

    }

    canvas.onmousemove = (ev: MouseEvent) => {
        if (!isHumansTurn()) return
        controller.move(ev)
        view.draw()
    }

    canvas.onmouseout = (ev: MouseEvent) => {
        controller.mouseout(ev)
        view.draw()
    }

    pass.onclick = () => {
        if (!isHumansTurn()) return
        board.pass()
        cpusTurn()
    }
}
