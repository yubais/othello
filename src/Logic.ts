/* CPU の思考を担うクラス。といっても大した思考はしない。 */

import { Board } from './Board'

type Position = [number, number]
export class Logic {
    level: number
    constructor(level: number) {
        this.level === level
    }

    next = (board: Board): Position => {
        // 次の手を返す
        const placable = board.getPlacableAll()
        return placable[Math.floor(Math.random() * placable.length)]
    }
}
