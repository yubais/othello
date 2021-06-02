import { Board } from "./Board"
import { View } from "./View"
import { Controller } from "./Controller"

window.onload = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error("このブラウザには対応していません。")
    canvas.width = 640
    canvas.height = 640

    const board = new Board()
    const draw = new View(canvas, board)
    const controller = new Controller(canvas, board)
}