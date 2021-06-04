import { Board } from "./Board"
import { View } from "./View"
import { Controller } from "./Controller"
import { Logic } from "./Logic"

const dg = (id) => {
    return document.getElementById(id)
}

const levelDescription = {
    1: 'CPU Level 1（無策）: 置ける場所からランダムに選びます。',
    2: 'CPU Level 2（刹那）: 一番多く裏返せる場所を選びます。',
    3: 'CPU Level 3（鳥頭）: 3手先に自色が多くなる手を選びます。',
}

const setModalPosition = () => {
    /* modal の位置調整 */
    const canvas = document.querySelector('canvas')
    const modal = dg('modal-wrapper') as HTMLDivElement

    const canvasRect = canvas.getClientRects()[0]

    modal.style.width = canvasRect.width + 'px'
    modal.style.height = canvasRect.height + 'px'
    modal.style.left = canvasRect.left + 'px'
    modal.style.top = canvasRect.top + 'px'

    /* status bar の幅調整 */
    dg('status').style.width = canvasRect.width + 'px'
}

window.onresize = setModalPosition

const finishGame = (state: string) => {
    const statement = (() => {
        if (state == 'blackWin') return '黒の勝利'
        if (state == 'whiteWin') return '白の勝利'
        if (state == 'even') return '引き分け'    
    })()
    dg('modal-content').textContent = statement
    dg('modal-wrapper').style.display = 'block'

    dg('pass-box').style.display = 'none'
    dg('retry-box').style.display = 'block'
    dg('retry-box').onclick = () => { location.reload() }
}

window.onload = () => {
    const canvas = document.querySelector('canvas')
    const pass = dg('pass-box') as HTMLDivElement
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
    dg('description').textContent = levelDescription[urlParams['l']]

    const isHumansTurn = ():boolean => {
        if (playMode === 1) return board.turn === 'white' // p=1 で人が白番
        if (playMode === 2) return true // p=2 で人対人
        if (playMode === 3) return false // p=3 で CPU vs CPU
        // default は人が黒番
        return board.turn === 'black'
    }
    const cpuDelay = (urlParams['p'] === 3) ? 10 : 150

    const countBlack = dg('count-black')
    const countWhite = dg('count-white')
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

    dg('configButton').onclick = () => {
        dg('config').style.display = (dg('config').style.display == 'none') ? 'block' : 'none'
    }

    dg('submit').onclick = () => {
        let optStr = '?'

        // 盤面サイズ
        const radioBoardSize = document.getElementsByName('boardSize') as NodeListOf<HTMLInputElement>
        radioBoardSize.forEach( (el: HTMLInputElement) => {
            if (el.checked) {
                if (el.value == 'custom') {
                    const w = Number((dg('boardW') as HTMLInputElement).value)
                    const h = Number((dg('boardH') as HTMLInputElement).value)
                    optStr += 'w=' + w + '&h=' + h
                } else {
                    optStr += el.value
                }
            }
        })

        const blackHuman = dg('blackHuman') as HTMLInputElement
        const whiteHuman = dg('blackHuman') as HTMLInputElement
        const blackCPU = dg('blackCPU') as HTMLInputElement
        const whiteCPU = dg('whiteCPU') as HTMLInputElement
        
        // 対戦モード
        if (blackHuman.checked && whiteCPU.checked) optStr += '&p=0'
        if (blackCPU.checked && whiteHuman.checked) optStr += '&p=1'
        if (blackHuman.checked && whiteHuman.checked) optStr += '&p=2'
        if (blackCPU.checked && whiteCPU.checked) optStr += '&p=3'

        // CPU Level
        const radioCPUlevel = document.getElementsByName('CPUlevel') as NodeListOf<HTMLInputElement>
        radioCPUlevel.forEach( (el: HTMLInputElement) => {
            if (el.checked) {
                optStr += '&l=' + el.value
            }
        })
        console.log(optStr)

        location.href = './' + optStr
    }

    dg('boardW').onclick = () => {
        (dg('customBoard') as HTMLInputElement).checked = true
    }
    dg('boardH').onclick = () => {
        (dg('customBoard') as HTMLInputElement).checked = true
    }
}
