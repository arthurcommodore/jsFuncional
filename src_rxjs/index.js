
const path = require('path')
const fn = require('./funcoes')

const caminho = path.join(__dirname, '..', 'dados', 'legendas')
console.log(caminho)
const simbolos = [
    '.', '?', '-', ',', '"', '♪',
    '_', '<i>', '</i>', '\r', '[', ']',
    '(', ')'
]

fn.lerDiretorio(caminho)
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

