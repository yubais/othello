import { Board } from "./Board"
import { View } from "./View"
import { Controller } from "./Controller"
import { Logic } from "./Logic"

const levelDescription = {
    1: 'CPU Level 1（無策）: 置ける場所からランダムに選びます。',
    2: 'CPU Level 2（刹那）: 一番多く裏返せる場所を選びます。',
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

    /* status bar の幅調整 */
    document.getElementById('status').style.width = canvasRect.width + 'px'
}

window.onresize = setModalPosition

const finishGame = (state: string) => {
    const statement = (() => {
        if (state == 'blackWin') return '黒の勝利'
        if (state == 'whiteWin') return '白の勝利'
        if (state == 'even') return '引き分け'    
    })()
    document.getElementById('modal-content').textContent = statement
    document.getElementById('modal-wrapper').style.display = 'block'

    document.getElementById('pass-box').style.display = 'none'
    document.getElementById('retry-box').style.display = 'block'
    document.getElementById('retry-box').onclick = () => { location.reload() }
}

window.onload = () => {
    const canvas = document.querySelector('canvas')
    const pass = document.getElementById('pass-box') as HTMLDivElement
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
        urlParams['l'] = 1
    }

    // プレイモード
    const playMode = (urlParams['p']) ? urlParams['p'] : 0

    const board = new Board(urlParams['w'], urlParams['h'])
    const view = new View(canvas, board)
    const controller = new Controller(canvas, board)

    const logic = new Logic(urlParams['l'])
    document.getElementById('description').textContent = levelDescription[urlParams['l']]

    const isHumansTurn = ():boolean => {
        if (playMode === 1) return board.turn === 'white' // p=1 で人が白番
        if (playMode === 2) return true // p=2 で人対人
        if (playMode === 3) return false // p=3 で CPU vs CPU
        // default は人が黒番
        return board.turn === 'black'
    }
    const cpuDelay = (urlParams['p'] === 3) ? 10 : 150

    const countBlack = document.getElementById('count-black')
    const countWhite = document.getElementById('count-white')
    const renewCount = () => {
        const count = board.count()
        countBlack.textContent = String(count[0])
        countWhite.textContent = String(count[1])
    }

    setModalPosition()
    renewCount()

    const cpusTurn = () => {
        setTimeout( () => {
            const cpuChoice = logic.next(board)
            if (cpuChoice === undefined) {
                board.pass()
            } else {
                board.place( cpuChoice )
            }
            view.draw()
            
            renewCount()
            const state = board.checkState()
            if (state !== 'inGame') {
                finishGame(state)
                return
            }
            if (!isHumansTurn()) {
                cpusTurn()
                return
            }
        }, cpuDelay) // 対人戦なら150、CPU同士ならもっと短く
    }

    if (!isHumansTurn()) {
        // 初手がCPUである場合
        cpusTurn()
    }

    canvas.onclick = (ev: MouseEvent) => {
        if (!isHumansTurn()) return
        controller.click(ev)
        view.draw()

        renewCount()
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

}
