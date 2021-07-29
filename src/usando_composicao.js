const path = require('path')
const fn = require('./funcoes')

const caminho = path.join(__dirname, '..', 'dados', 'legendas')

const simbolos = [
    '.', '?', '-', ',', '"', '♪',
    '_', '<i>', '</i>', '\r', '[', ']',
    '(', ')'
]

const palavrasMaisUsadas = fn.composicao(
    fn.lerDiretorio,
    fn.extensaoArquivo('.srt'),
    fn.lerArquivos,
    conteudo => conteudo.join(' '),
    conteudo => conteudo.split('\n'),
    fn.removerVazio,
    fn.removeTime,
    fn.removeOnlyNumbers,
    fn.tirarSimbolos(simbolos),
    conteudo => conteudo.join(' '),
    conteudo => conteudo.split(' '),
    fn.removerVazio,
    fn.removeOnlyNumbers,
    fn.agruparElementos,
    fn.ordenarQtd(`qtd`, 'desc')
)

palavrasMaisUsadas(caminho)
    .then(console.log)
