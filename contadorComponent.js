// IIFE -> Immeately Invoked Function Expression
(() => {

    const BTN_REINICIAR = "btnReiniciar"
    const ID_CONTADOR = "contador"
    const VALOR_CONTADOR = 100
    const PERIODO_INTERVALO = 10

    class ContadorComponent {

        constructor() {
            this.inicializar()
        }
        prepararContadorProxy() {
                const handler = {
                        set: (currentContext, propertyKey, newValue) => {
                            console.log({ currentContext, propertyKey, newValue })
                                // para parar todo o processamento
                            if (!currentContext.valor) {
                                currentContext.efetuarParada()
                            }

                            currentContext[propertyKey] = newValue
                            return true
                        }
                    }
                    //Proxy server para ficar observando um objeto e suas modificações
                const contador = new Proxy({
                    valor: VALOR_CONTADOR,
                    efetuarParada: () => {}
                }, handler)

                return contador

            }
            //closure - cria novos contextos - a primeira fez que você chama, ele não executa, ele apenas "guarda" a assinatura, para a próxima vez ele chamar
        atualizarTexto = ({ elementoContador, contador }) => () => {
            const identificadorTexto = '$$contador'
            const textoPadrao = `Começando em <strong>${identificadorTexto}</strong> segundos...`
            elementoContador.innerHTML = textoPadrao.replace(identificadorTexto, contador.valor--)
        }

        agendarParadaContador({ elementoContador, idIntervalo }) {

            return () => {
                clearInterval(idIntervalo)

                elementoContador.innerHTML = ""
                this.desabilitarBotao(false)
            }

        }
        prepararBotao(elementoBotao, iniciarFn) {

            // Troca do contexto do this -> iniciarFn.bind(this)
            elementoBotao.addEventListener('click', iniciarFn.bind(this));

            return (valor = true) => {
                const atributo = 'disabled'
                    // evita que tenham varios eventos no botao de forma necessaria
                    // remove a funcao: pergunta do victor!
                elementoBotao.removeEventListener('click', iniciarFn.bind(this))

                if (valor) {
                    elementoBotao.setAttribute(atributo, valor)
                    return;
                }

                elementoBotao.removeAttribute(atributo)

            }
        }

        inicializar() {
            console.log('inicializou!!')
            const elementoContador = document.getElementById(ID_CONTADOR)

            const contador = this.prepararContadorProxy()

            const argumentos = {
                elementoContador,
                contador
            }

            const fn = this.atualizarTexto(argumentos)
            const idIntervalo = setInterval(fn, PERIODO_INTERVALO)

            {
                const elementoBotao = document.getElementById(BTN_REINICIAR)
                const desabilitarBotao = this.prepararBotao(elementoBotao, this.inicializar)
                desabilitarBotao()

                const argumentos = { elementoContador, idIntervalo }

                //{ desabilitarBotao} troca o escopo do this
                const pararContadorFn = this.agendarParadaContador.apply({ desabilitarBotao }, [argumentos])
                contador.efetuarParada = pararContadorFn
            }

        }
    }

    window.ContadorComponent = ContadorComponent
})()