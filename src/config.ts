// config まわりの管理

const dgd = (id: string): HTMLDivElement => {
    return (document.getElementById(id) as HTMLDivElement)
}

const dgi = (id: string): HTMLInputElement => {
    return (document.getElementById(id) as HTMLInputElement)
}

export function setConfigUI(urlParams: {[key: string]: number}) {

    if (urlParams['w'] == undefined && urlParams['h'] == undefined) {
        dgi('normalBoard').checked = true
    } else if (urlParams['w'] == 6 && urlParams['h'] == 6) {
        dgi('smallBoard').checked = true
    } else if (urlParams['w'] == 8 && urlParams['h'] == 8) {
        dgi('normalBoard').checked = true
    } else if (urlParams['w'] == 12 && urlParams['h'] == 12) {
        dgi('largeBoard').checked = true
    } else {
        dgi('customBoard').checked = true
        dgi('boardW').value = String(urlParams['w'])
        dgi('boardH').value = String(urlParams['h'])
    }

    const blackHuman = dgi('blackHuman')
    const whiteHuman = dgi('whiteHuman')
    const blackCPU = dgi('blackCPU')
    const whiteCPU = dgi('whiteCPU')

    if (urlParams['p'] == 1) {
        blackCPU.checked = true
        whiteHuman.checked = true
    }
    if (urlParams['p'] == 2) {
        blackHuman.checked = true
        whiteHuman.checked = true
    }
    if (urlParams['p'] == 3) {
        blackCPU.checked = true
        whiteCPU.checked = true
    }

    const radioLevel = document.getElementsByName('CPUlevel') as NodeListOf<HTMLInputElement>
    radioLevel.forEach( (el: HTMLInputElement) => {
        if (el.value === String(urlParams['l'])) {
            el.checked = true
        }
    })

    dgd('configButton').onclick = () => {
        dgd('config').style.display = (dgd('config').style.display == 'none') ? 'block' : 'none'
    }

    dgd('submit').onclick = () => {
        let optStr = '?'

        // 盤面サイズ
        const radioBoardSize = document.getElementsByName('boardSize') as NodeListOf<HTMLInputElement>
        radioBoardSize.forEach( (el: HTMLInputElement) => {
            if (el.checked) {
                if (el.value == 'custom') {
                    const w = Number(dgi('boardW').value)
                    const h = Number(dgi('boardH').value)
                    optStr += 'w=' + w + '&h=' + h
                } else {
                    optStr += el.value
                }
            }
        })
        
        // 対戦モード
        if (blackHuman.checked && whiteCPU.checked  ) optStr += '&p=0'
        if (blackCPU.checked   && whiteHuman.checked) optStr += '&p=1'
        if (blackHuman.checked && whiteHuman.checked) optStr += '&p=2'
        if (blackCPU.checked   && whiteCPU.checked  ) optStr += '&p=3'

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

    dgi('boardW').onclick = () => {
        dgi('customBoard').checked = true
    }
    dgi('boardH').onclick = () => {
        dgi('customBoard').checked = true
    }
}
