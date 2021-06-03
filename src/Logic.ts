/* CPU の思考を担うクラス。といっても大した思考はしない。 */

import { Board } from './Board'

type Position = [number, number]
export class Logic {
    level: number = 2

    constructor(level: number) {
        if (level == 1) this.level = 1
        if (level == 2) this.level = 2
        if (level == 3) this.level = 3
    }

    next = (board: Board): Position => {
        if (this.level === 1) return this.random(board)
        if (this.level === 2) return this.greed(board)
        if (this.level === 3) return this.bird(board)
    }

    random = (board: Board): Position => {
        // 可能な選択肢からランダムに選択
        const placable = board.getPlacableAll()
        return placable[Math.floor(Math.random() * placable.length)]
    }

    greed = (board: Board): Position => {
        // 一番多く裏返せる手（複数ある場合はランダム）
        const placable = board.getPlacableAll()
        const candidate: Position[] = new Array()
        let superiority = -Infinity

        for (const pl of placable) {
            // 仮想的盤面を生成
            const clone = board.clone()
            clone.place(pl)
            const count = clone.count()
            const diff = (board.turn === 'black') ? count[0] - count[1] : count[1] - count[0]

            // これまでの候補と同等な場合
            if (diff == superiority) {
                candidate.push(pl)
            }

            // これまでの候補に勝る場合
            if (diff > superiority) {
                candidate.splice(0)
                candidate.push(pl)
                superiority = diff
            }
        }
        return candidate[Math.floor(Math.random() * candidate.length)]
    }

    bird = (board: Board): Position => {
        // 3手先で greed を使い miniMax 
        // 「相手が最悪の2手目を指してもそこまで悪くならない1手目」を選ぶ

        const placable = board.getPlacableAll()
        const candidate: Position[] = new Array()
        let sup1 = -Infinity

        for (const myp of placable) {
            const nBoard = board.clone() // 1手先の盤面
            nBoard.place(myp)
            const yourPlacable = nBoard.getPlacableAll()

            if (yourPlacable.length == 0) {
                // 相手の手がない場合、まず自分の指し手があるのかを調べる
                nBoard.pass()
                const my2p = nBoard.getPlacableAll()
                if (my2p.length == 0) {
                    // 自分の指し手もない場合、この1手目を指した時点で終局。
                    // その時点の状態をスコアとして返す。
                }
            }

            // 今回は argmax 的なものをとらなくていい
            const sup3: number[] = new Array()

            for (const urp of yourPlacable) {
                const nnBoard = nBoard.clone()
                nnBoard.place(urp) // 2手目を実行。ここで対局が終わる可能性もある

                const thirdPos = this.greed(nnBoard)
                if (thirdPos) {
                    // 3手目を実行
                    nnBoard.place(thirdPos)
                } // 3手先がない場合は2手先の盤面を評価する
                const count = nnBoard.count()
                const diff = (board.turn === 'black') ? count[0] - count[1] : count[1] - count[0]
                sup3.push(diff)
            }

            const sup3min = Math.min.apply(null, sup3) // 各2手目に対する3手目の優位性の最小値
            
            if (sup3min == sup1) {
                candidate.push(myp)
            }
            if (sup3min > sup1) {
                candidate.splice(0)
                candidate.push(myp)
                sup1 = sup3min
            }
        }
        return candidate[Math.floor(Math.random() * candidate.length)]
    }
}
