/* CPU の思考を担うクラス。といっても大した思考はしない。 */

import { Board } from './Board'

type Position = [number, number]
export class Logic {
    level: number = 2

    constructor(level: number) {
        if (level == 1) this.level = 1
        if (level == 2) this.level = 2
    }

    next = (board: Board): Position => {
        if (this.level === 1) return this.random(board)
        if (this.level === 2) return this.greed(board)
    }

    random = (board: Board): Position => {
        // 次の手を返す
        const placable = board.getPlacableAll()
        return placable[Math.floor(Math.random() * placable.length)]
    }

    greed = (board: Board): Position => {
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
}
