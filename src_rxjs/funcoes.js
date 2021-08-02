const fs = require('fs')
const path = require('path')
const {Observable} = require('rxjs')

function createPipeableOperator(operatorFn) {
    return function(source) {
        return Observable.create(subscriber => {
            const sub = operatorFn(subscriber)
            source.subscribe({
                next: sub.next,
                error: sub.erro || (e => subscriber.error(e)),
                complete: sub.erro || (e => subscriber.complete(e))
            })
        })
    }
}

function composicao(...fns) {
    return function(valor) {
        return fns.reduce(async (acc, fn) => {
            if(Promise.resolve(acc) === acc) {
                return fn(await acc)
            } else {
                return fn(acc)
            }
        }, valor)
    }
}

function lerDiretorio(caminho) {
    return new Observable(subscriber => {
        try{
            fs.readdirSync(caminho).forEach(arquivo => {
                subscriber.next(path.join(caminho, arquivo))
            })
            subscriber.complete()
        } catch (e) {
            subscriber.error(e)
        }
    })
}

function extensaoArquivo(padrao) {
    return function(array) {
        return array.filter(arquivo => arquivo.endsWith(padrao))
    }
}

function lerArquivos(caminho) {
    return createPipeableOperator(subscriber => ({
        next(caminho) {
            try {
                let conteudo = fs.readFileSync(caminho, {encoding: 'utf-8'})
                subscriber.next((conteudo.toString()))
            }catch(e) {
                subscriber.erro(e)
            }
        }
    }))
}

function separarTextoPor(simbolo) {
    return createPipeableOperator(subscriber => ({
        next(texto) {
            try {
                texto.split(simbolo).forEach(elem => subscriber.next(elem))

            }catch(e) {
                subscriber.erro(e)
            }
        }
    }))
}

function removerVazio() {
    return createPipeableOperator(subscriber => ({
        next(texto) {
            if(texto.trim()) 
                subscriber.next(texto)
        }
    }))
}

function elementosTerminadosCom(padraoTextual) {
    return createPipeableOperator(subscriber => ({
        next(texto) {
            if(texto.endsWith(padraoTextual)) {
                subscriber.next(texto)
            }
        }
    }))
}

function tirarSimbolos(simbolos) {
    return createPipeableOperator(subscriber => ({
        next(texto) {
            simbolos.forEach(elem => {
                texto = texto.split(elem).join('')
            })
            subscriber.next(texto)
        }
    }))
}

function agruparElementos() {
    return createPipeableOperator(subscriber => ({
        next(palavras) {
            const agrupado = Object.values(
                palavras.reduce((acc, palavra) => {
                    const el = palavra.toLowerCase()
                    const qtd = acc[el] ? acc[el].qtd + 1 : 1
                    acc[el] = {elemento : el, qtd}
                    return acc
                }, {}))
            subscriber.next(agrupado)
        }
    }))
}

function ordenarQtd(attr, ordem = `asc`) {
    return function(array) {
        const asc = (o1, o2) => o1[attr] - o2[attr]
        const desc = (o1, o2) => o2[attr] - o1[attr]

        return [...array].sort(ordem === `asc` ? asc: desc)
    }
}

function removeOnlyNumbers() {
    return createPipeableOperator(subscriber => ({
        next(texto) {
            if(parseInt(texto.trim()) !== parseInt(texto.trim()))
                subscriber.next(texto)
        }
    }))
}


module.exports = {
    lerDiretorio, 
    extensaoArquivo, 
    lerArquivos, 
    removerVazio, 
    elementosTerminadosCom,
    tirarSimbolos,
    agruparElementos,
    ordenarQtd,
    composicao,
    removeOnlyNumbers,
    separarTextoPor
}