
const path = require('path')
const { toArray, map } = require('rxjs')
const _ = require('lodash')
const fn = require('./funcoes')

const caminho = path.join(__dirname, '..', 'dados', 'legendas')
const simbolos = [
    '.', '?', '-', ',', '"', '♪',
    '_', '<i>', '</i>', '\r', '[', ']',
    '(', ')' 
]

fn.lerDiretorio(caminho)
    .pipe(
        fn.elementosTerminadosCom(`.srt`),
        fn.lerArquivos(caminho),
        fn.separarTextoPor('\n'),
        fn.removerVazio(),
        fn.removeOnlyNumbers(),
        fn.tirarSimbolos(simbolos),
        fn.separarTextoPor(' '),
        fn.removeOnlyNumbers(),
        toArray(),
        fn.agruparElementos(),
        map(array => _.sortBy(array, el => -el.qtd))
    )
    .subscribe(console.log)

// fn.lerDiretorio(caminho)
//     .then(fn.extensaoArquivo('.srt'))
//     .then(fn.lerArquivos)
//     .then(conteudo => conteudo.join(' '))
//     .then(conteudo => conteudo.split('\n'))
//     .then(fn.removerVazio)
//     .then(fn.removeTime)
//     .then(fn.removeOnlyNumbers)
//     .then(fn.tirarSimbolos(simbolos))
//     .then(conteudo => conteudo.join(' '))
//     .then(conteudo => conteudo.split(' '))
//     .then(fn.removerVazio)
//     .then(fn.removeOnlyNumbers)
//     .then(fn.agruparElementos)
//     .then(fn.ordenarQtd(`qtd`, `desc`))
//     .then(console.log)

