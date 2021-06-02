import { Board } from "./Board"
import { View } from "./View"
import { Controller } from "./Controller"
import { Logic } from "./Logic"

const setModalPosition = () => {
    /* modal の位置調整 */
    const canvas = document.querySelector('canvas')
    const modal = document.getElementById('modal-wrapper') as HTMLDivElement

    const canvasRect = canvas.getClientRects()[0]

    modal.style.width = canvasRect.width + 'px'
    modal.style.height = canvasRect.height + 'px'
    modal.style.left = canvasRect.left + 'px'
    modal.style.top = canvasRect.top + 'px'
}

window.onresize = setModalPosition

window.onload = () => {
    const canvas = document.querySelector('canvas')
    const pass = document.getElementById('pass') as HTMLAnchorElement

    if (!canvas) throw new Error("このブラウザには対応していません。")

    const board = new Board()
    const view = new View(canvas, board)
    const controller = new Controller(canvas, board)
    const logic = new Logic(2)
    const isHumansTurn = ():boolean => {
        return board.turn === 'black' // 暫定的にヒトは黒番で固定
    }

    setModalPosition()    

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
            
            const state = board.checkState()
            if (state !== 'inGame') {
                finishGame(state)
            }
        }, 150)
    }

    canvas.onclick = (ev: MouseEvent) => {
        if (!isHumansTurn()) return
        controller.click(ev)
        view.draw()

        const state = board.checkState()
        if (state !== 'inGame') {
            finishGame(state)
            return
        }

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

    const finishGame = (state: string) => {
        const statement = (() => {
            if (state == 'blackWin') return '黒の勝利'
            if (state == 'whiteWin') return '白の勝利'
            if (state == 'even') return '引き分け'
            
        })()
        document.getElementById('modal-content').textContent = statement
        document.getElementById('modal-wrapper').style.display = 'block'
    }
}
