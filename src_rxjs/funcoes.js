const fs = require('fs')
const path = require('path')
const {Observable} = require('rxjs')

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
        try {
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

function lerArquivo(caminho) {
    return new Promise((resolve, reject) => {
        try {
            let conteudo = fs.readFileSync(caminho, {encoding: 'utf-8'})
            resolve(conteudo.toString())
        }catch(e) {
            reject(e)
        }
    })
}

function lerArquivos(caminhos) {
    return Promise.all(caminhos.map(caminho => lerArquivo(caminho)))
}

function removerVazio(conteudo) {
    return conteudo.filter(linha => linha.trim())
}

function removeTime(conteudo) {
    return conteudo.filter(el => !el.includes('-->'))
}

function tirarSimbolos(simbolos) {
    return function(array) {
        return array.map(elem => {
            return simbolos.reduce((acc, simbolo) => acc.split(simbolo).join(''), elem)
        })
    }
}


function agruparElementos(palavras) {
    return Object.values(palavras.reduce((acc, palavra) => {
        const el = palavra.toLowerCase()
        const qtd = acc[el] ? acc[el].qtd + 1 : 1
        acc[el] = {elemento: el, qtd}
        return acc
    }, {}))
}

function ordenarQtd(attr, ordem = `asc`) {
    return function(array) {
        const asc = (o1, o2) => o1[attr] - o2[attr]
        const desc = (o1, o2) => o2[attr] - o1[attr]

        return [...array].sort(ordem === `asc` ? asc: desc)
    }
}

function removeOnlyNumbers(array) {
    return array.filter(el => {
        const num = parseInt(el.trim())
        return num !== num
    })
}


module.exports = {
    lerDiretorio, 
    extensaoArquivo, 
    lerArquivos, 
    removerVazio, 
    removeTime,
    tirarSimbolos,
    agruparElementos,
    ordenarQtd,
    composicao,
    removeOnlyNumbers
}