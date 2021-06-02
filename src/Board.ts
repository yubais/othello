/* オセロのルールを管理するクラス。画面描写や戦略思考はしない。 */

type Color = 'black' | 'white'
type StateOfSquare = 'empty' | 'black' | 'white' | 'border'
type Direction = 'left' | 'right' | 'up' | 'down' | 'upleft' | 'upright' | 'downleft' | 'downright' 
type Position = [number, number]

export class Board {
	state: StateOfSquare[][]
	width: number = 8
	height: number = 8
	selected: [number, number] = [-1, -1]
	turn: Color = 'black'
	get enemy(): Color {
		if (this.turn == 'black') return 'white'
		else return 'black'
	}

	constructor() {
		this.state = new Array()
		for (let ix = 0; ix < this.width; ix++) {
			this.state[ix] = new Array()
			for(let iy = 0; iy < this.height; iy++) {
				this.state[ix].push('empty')
			}
		}
		const x_mid = Math.floor(this.width/2)
		const y_mid = Math.floor(this.height/2)

		this.state[x_mid-1][y_mid-1] = 'black'
		this.state[x_mid  ][y_mid  ] = 'black'
		this.state[x_mid-1][y_mid  ] = 'white'
		this.state[x_mid  ][y_mid-1] = 'white'
	}

	count = () => {
		let n_black = 0
		let n_white = 0
		for (let ix = 0; ix < this.width; ix++) {
			for (let iy = 0; iy < this.height; iy++) {
				if (this.state[ix][iy] == 'black') n_black++
				if (this.state[ix][iy] == 'white') n_white++
			}
		}
		return [n_black, n_white]
	}

	show = () => {
		for (let iy = 0; iy < this.height; iy ++) {
			let line = ''
			for(let ix = 0; ix < this.width; ix ++) {
				if (this.state[ix][iy] == 'empty') line += '_ '
				if (this.state[ix][iy] == 'black') line += 'B '
				if (this.state[ix][iy] == 'white') line += 'W '
			}
			console.log(line)
		}
	}

	getState = (pos: Position): StateOfSquare => {
		if ( (pos[0] == -1) || (pos[0] == this.width) || (pos[1] == -1) || (pos[1] == this.height) ) return 'border'
		return this.state[pos[0]][pos[1]]
	}
	setState = (pos: Position, state: StateOfSquare) => {
		this.state[pos[0]][pos[1]]= state
	}

	getNextPos = (pos: Position, dir: Direction): [number, number] => {
		let jx = pos[0]
		let jy = pos[1]

		if (dir === 'left') jx--
		if (dir === 'right') jx++
		if (dir === 'up') jy--
		if (dir === 'down') jy++
		if (dir === 'upleft') {
			jx--
			jy--
		}
		if (dir === 'upright') {
			jx++
			jy--
		}
		if (dir === 'downleft') {
			jx--
			jy++
		}
		if (dir === 'downright') {
			jx++
			jy++
		}
		return [jx, jy]
	}

	isReversibleLine = (pos: Position, dir: Direction): boolean => {
		// ある位置にある色の石を置いたとき、指定方向が反転可能な石列になっているか？
		const nextPos = this.getNextPos(pos, dir)

		if (this.getState(nextPos) === this.enemy) {
			const nextnextPos = this.getNextPos(nextPos, dir)
			const nextnextState = this.getState(nextnextPos)
			if (nextnextState === this.turn) {
				// 隣が敵で、隣の隣が味方 → 反転可能
				return true 
			}
			if (nextnextState === this.enemy) {
				// 隣が敵で、隣の隣も敵 → 再帰が必要
				return this.isReversibleLine(nextPos, dir)
			}
			// 隣が敵で、隣の隣は無または壁 → 反転不可能 
			return false
		}
		
		// 隣が敵でない → 反転不可能
		return false
	}

	isPlaceable = (pos: Position): boolean => {
		// そもそも他のコマが置いてあったらダメ
		if (this.getState(pos) !== 'empty') return false

		const dirs: Direction[] = ['left', 'right', 'up', 'down', 'upleft', 'upright', 'downleft', 'downright']
		for (let dir of dirs) {
			if (this.isReversibleLine(pos, dir)) return true // 1方向でも反転可能なら設置可能
		}
		return false
	}

	reverseLine = (pos: Position, dir: Direction) => {
		// 破壊的メソッド
		const nextPos = this.getNextPos(pos, dir)
		if (this.getState(nextPos) == this.enemy) {
			this.setState(nextPos, this.turn)
			this.reverseLine(nextPos, dir)
		}
	}

	getPlacableAll = (): Position[] => {
		let callback: Position[] = new Array()
		for (let ix = 0; ix < this.width; ix++) {
			for (let iy = 0; iy < this.height; iy++) {
				if (this.isPlaceable([ix, iy])) callback.push([ix, iy])
			}
		}
		return callback
	}

	place = (pos: Position) => {
		if (this.isPlaceable(pos) == false) {
			throw new Error('You cannot place this position.')
		}
		this.setState(pos, this.turn)

		const dirs: Direction[] = ['left', 'right', 'up', 'down', 'upleft', 'upright', 'downleft', 'downright']
		for(const dir of dirs) {
			if (this.isReversibleLine(pos, dir)) {
				this.reverseLine(pos, dir)
			}
		}
		this.checkEnd()
		this.turn = this.enemy
	}

	checkEnd = () => {
		const count = this.count()

		if (count[0] == 0) console.log("白の勝利")
		if (count[1] == 0) console.log("黒の勝利")

		if (count[0] + count[1] == this.width * this.height) {
			if(count[0] > count[1]) console.log("黒の勝利")
			if(count[0] < count[1]) console.log("白の勝利")
			if(count[0] == count[1]) console.log("ひきわけ")
		}

	}

	pass = () => {
		this.turn = this.enemy
	}

	clone = ():Board => {
		const child = new Board()
		for(let ix=0; ix<this.width; ix++) {
			for(let iy=0; iy<this.height; iy++) {
				child.state[ix][iy] = this.state[ix][iy]
			}
		}
		child.turn = this.turn
		return child
	}
}

/*
const board = new Board()
board.show()

for (let i=0; i<10; i++) {
	board.replaceState(board.getPlacableAll()[0])
	board.show()
	console.log(" ")	
}
*/