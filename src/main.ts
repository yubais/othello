import { Board } from "./Board"
import { View } from "./View"
import { Controller } from "./Controller"
import { Logic } from "./Logic"

const levelDescription = {
    1: 'CPU Level 1（無策）: 置ける場所からランダムに選びます。',
    2: 'CPU Level 2（貪欲）: 一番多く裏返せる場所を選びます。',
    3: 'CPU Level 3（鳥頭）: 3手先に自色が多くなる手を選びます。',
}

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

    // URL の読み込み、ただし値は数値のみ
    const urlParams: {[key: string]: number} = (() => {
        const callback = {}
        window.location.search
            .substr(1)
            .split('&')
            .forEach((item) => {
                const tmp = item.split('=')
                if (isNaN(tmp[1] as any) === false) {
                    callback[tmp[0]] = Number(tmp[1])
                }
            })
        return callback
    })()

    // レベル指定について
    if ([1, 2, 3].includes(urlParams['l']) === false) {
        urlParams['l'] = 2
    }

    const board = new Board(urlParams['w'], urlParams['h'])
    const view = new View(canvas, board)
    const controller = new Controller(canvas, board)

    const logic = new Logic(urlParams['l'])
    document.getElementById('description').textContent = levelDescription[urlParams['l']]

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
