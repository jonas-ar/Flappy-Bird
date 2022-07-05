let nome = document.getElementById("nome").value;
let cenario = document.querySelector('input[name="cenario"]:checked').value;
let intervalo = document.querySelector('input[name="intervalo"]:checked').value;
let distancia = document.querySelector('input[name="distancia"]:checked').value;
let velJogo = parseInt(document.getElementById("velJogo").value, 10);
let personagens = document.getElementById("personagens").value;
let tipoJogo = document.querySelector('input[name="tipo"]:checked').value;
let velocidade = document.querySelector('input[name="velocidade"]:checked').value;
let pontuacao = parseInt(document.querySelector('input[name="pontuacao"]:checked').value);

if (tipoJogo == "treino") {
    alert("Modo treino! aperte enter para voltar ao menu")
    document.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            document.location.reload(true);
        }
    });
}

function nivelPontuacao() {
    if (pontuacao === 1) {
        return 1
    } else if (pontuacao === 10) {
        return 10
    } else if (pontuacao === 100) {
        return 100
    }
}

// velocidade do personagem
function nivelVelocidade1() {
    if (velocidade === "baixa") {
        return 2
    } else if (velocidade === "media") {
        return 6
    } else if (velocidade === "rapida") {
        return 15
    }
}

// velocidade do personagem
function nivelVelocidade2() {
    if (velocidade === "baixa") {
        return -3
    } else if (velocidade === "media") {
        return -5
    } else if (velocidade === "rapida") {
        return -10
    }
}

// números aleatórios com mínimo e máximo
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function espacoBarreira() {
    // distância entre os canos
    if (distancia === "facil") {
        return 800
    } else if (distancia === "medio") {
        return 400
    } else if (distancia === "dificil") {
        return 200
    }
}

function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName)
    elemento.className = className
    return elemento
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`

    // cenário do jogo
    if (cenario === "noturno") {
        document.body.style.color = "#fff";
        var elemento = document.querySelector("[wm-flappy]");
        elemento.style.backgroundColor = "#1f1f1f";
        elemento.style.backgroundImage = "url('img/lua.gif')";
        elemento.style.backgroundRepeat = "no-repeat";
        elemento.style.backgroundSize = "550px 550px";
        elemento.style.backgroundPosition = "left top";
        corpo.style.background = "linear-gradient(90deg, #9e9e9e, #2e2e2e)";
        borda.style.background = "linear-gradient(90deg, #9e9e9e, #2e2e2e)";
    } else if (cenario === "diurno") {
        var elemento = document.querySelector("[wm-flappy]");
        elemento.style.backgroundImage = "url('img/sol.gif')";
        elemento.style.backgroundRepeat = "no-repeat";
        elemento.style.backgroundPosition = "right top";
        elemento.style.backgroundSize = "450px 450px";
    }
}

function ParDeBarreiras(altura, abertura, popsicaoNaTela) {
    this.elemento = novoElemento('div', 'par-de-barreiras')
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = popsicaoNaTela => this.elemento.style.left = `${popsicaoNaTela}px`
    this.getLargura = () => this.elemento.clientWidth

    // intervalo de abertura entre os canos
    if (intervalo === "facil") {
        this.sortearAbertura = () => {
            const alturaSuperior = randomInt(10, 100);
            const alturaInferior = randomInt(5, alturaSuperior);
            this.superior.setAltura(alturaSuperior);
            this.inferior.setAltura(alturaInferior);
        }
    } else if (intervalo === "medio") {
        this.sortearAbertura = () => {
            const alturaSuperior = Math.random() * (altura - abertura);
            const alturaInferior = altura - abertura - alturaSuperior;
            this.superior.setAltura(alturaSuperior);
            this.inferior.setAltura(alturaInferior);
        }
    } else if (intervalo === "dificil") {
        this.sortearAbertura = () => {
            const alturaSuperior = randomInt(150, 200);
            const alturaInferior = randomInt(180, alturaSuperior);
            this.superior.setAltura(alturaSuperior);
            this.inferior.setAltura(alturaInferior);
        }
    }

    this.sortearAbertura()
    this.setX(popsicaoNaTela)
}

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    if (espacoBarreira() === 200) {
        this.pares = [
            // mais barreiras são criadas para dar um efeito de fluidez no modo difícil
            new ParDeBarreiras(altura, abertura, largura),
            new ParDeBarreiras(altura, abertura, largura + espaco),
            new ParDeBarreiras(altura, abertura, largura + espaco * 2),
            new ParDeBarreiras(altura, abertura, largura + espaco * 3),
            new ParDeBarreiras(altura, abertura, largura + espaco * 4),
            new ParDeBarreiras(altura, abertura, largura + espaco * 5),
            new ParDeBarreiras(altura, abertura, largura + espaco * 6)
        ]
    } else {
        this.pares = [
            new ParDeBarreiras(altura, abertura, largura),
            new ParDeBarreiras(altura, abertura, largura + espaco),
            new ParDeBarreiras(altura, abertura, largura + espaco * 2),
            new ParDeBarreiras(altura, abertura, largura + espaco * 3)
        ]
    }

    const deslocamento = velJogo; // velocidade do jogo

    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura / 2
            const cruzouMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if (cruzouMeio) {
                notificarPonto()
            }
        })
    }
}

function Item(alturaJogo, src) {
    this.elemento = novoElemento('img', 'passaro');
    this.elemento.src = src;

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = popsicaoNaTela => this.elemento.style.left = `${popsicaoNaTela}px`

    this.animar = () => {

        const novoY = this.getY() - 5
        const novoX = this.getX() - 5

        const alturaMaxima = alturaJogo - this.elemento.clientWidth

        if (novoY <= 0 && novoX <= 0) {
            this.setY(0)
            this.setX(0)
            this.elemento.style.display = 'none';
        } else if (novoY >= alturaMaxima && novoX >= alturaMaxima) {
            this.setY(alturaMaxima)
            this.setX(alturaMaxima)
        } else {
            this.setY(novoY)
            this.setX(novoX)
        }
    }
    this.setY(alturaJogo / 2)
    this.setX(alturaJogo)
}

function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro')

    if (personagens == "kirby") {
        this.elemento.src = 'img/kirby.gif'
    } else if (personagens == "charizard") {
        this.elemento.src = 'img/charizard.gif'
        this.elemento.style.width = "70px";
    } else if (personagens == "passaro") {
        this.elemento.src = 'img/passaro.png'
    }

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = () => voando = true
    window.onkeyup = () => voando = false

    this.animar = () => {

        let valor1 = nivelVelocidade1(velocidade);
        let valor2 = nivelVelocidade2(velocidade);

        const novoY = this.getY() + (voando ? valor1 : valor2)

        const alturaMaxima = alturaJogo - this.elemento.clientWidth

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidiuItem(passaro, item) {
    let colidiu = false

    if (!colidiu) {
        colidiu = estaoSobrepostos(passaro.elemento, item.elemento)
    }
    return colidiu
}

function colidiu(passaro, barreiras) {
    let colidiu = false

    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento

            if (tipoJogo === "real") {
                colidiu = estaoSobrepostos(passaro.elemento, superior)
                    || estaoSobrepostos(passaro.elemento, inferior)
            } else if (tipoJogo === "treino") {
                colidiu = false
            }
        }
    })
    return colidiu

}

function FlappyBird() {
    let pontos = 0;
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()

    const barreiras = new Barreiras(altura, largura, 200,
        espacoBarreira(), () => progresso.atualizarPontos(pontos += nivelPontuacao()))

    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    if (tipoJogo === 'treino') {
        setInterval(() => {
            const itemestrela = new Item(largura, 'img/star.gif')

            areaDoJogo.appendChild(itemestrela.elemento)

            const temp = setInterval(() => {
                itemestrela.animar()
                if (colidiuItem(passaro, itemestrela)) {
                    passaro.elemento.style.animation = 'blink normal 10s infinite';
                    setTimeout(() => {
                        passaro.elemento.style.animation = 'none';
                    }, 10000);
                    areaDoJogo.removeChild(itemestrela.elemento)
                    clearInterval(temp);
                }
            }, 35)
        }, 20000)
    } else {
        setInterval(() => {
            const itemestrela = new Item(largura, 'img/star.gif')

            areaDoJogo.appendChild(itemestrela.elemento)

            const temp = setInterval(() => {
                itemestrela.animar()
                if (colidiuItem(passaro, itemestrela)) {
                    tipoJogo = 'treino';
                    passaro.elemento.style.animation = 'blink normal 10s infinite';
                    setTimeout(() => {
                        tipoJogo = 'real';
                        passaro.elemento.style.animation = 'none';
                    }, 10000);
                    areaDoJogo.removeChild(itemestrela.elemento)
                    clearInterval(temp);
                }
            }, 35)
        }, 20000)
    }

    setInterval(() => {
        const item = new Item(largura, 'img/maca.gif')

        areaDoJogo.appendChild(item.elemento)

        const temp = setInterval(() => {
            item.animar()
            if (colidiuItem(passaro, item)) {
                areaDoJogo.removeChild(item.elemento)
                progresso.atualizarPontos(pontos += 10)
                clearInterval(temp)
            }
        }, 60)
    }, 10000)

    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if (colidiu(passaro, barreiras)) {
                alert("Game over! " + nome + "\n" + "Pontuação: " + pontos);
                clearInterval(temporizador)
                document.location.reload(true);
            }

        }, 20)
    }
}

new FlappyBird().start()