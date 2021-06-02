import { Draw } from "./Draw"

window.onload = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error("このブラウザには対応していません。")
    const draw = new Draw(canvas)
}