import type { LevelLesson } from '../contentTypes';

export const N5_LESSON: LevelLesson = {
  "levelTag": "N5",
  "title": "Arrays",
  "subtitle": "Agora você vai guardar vários valores juntos, acessar posições e transformar listas usando os mesmos fundamentos de repetição que já conhece.",
  "rewardXp": 85,
  "steps": [
    {
      "id": "array-idea",
      "type": "concept",
      "eyebrow": "01 · CONCEITO",
      "title": "Um array guarda vários valores",
      "body": "Um array é uma coleção ordenada de valores. Em vez de criar uma variável para cada número, você pode reunir vários valores em uma única estrutura.",
      "code": "const numeros = [10, 20, 30];\n\n// um único array guarda os três valores",
      "explanation": "Os valores ficam em posições diferentes da mesma lista. Você poderá acessar, percorrer e transformar essas posições usando os conceitos que já aprendeu."
    },
    {
      "id": "array-index",
      "type": "example",
      "eyebrow": "02 · ÍNDICES",
      "title": "As posições começam em 0",
      "body": "Assim como nas Strings do N4, o primeiro índice de um array é 0. Você pode usar os colchetes para acessar uma posição específica.",
      "code": "const numeros = [10, 20, 30];\n\nnumeros[0]; // 10\nnumeros[2]; // 30",
      "explanation": "A sequência de índices é 0, 1, 2... O último índice pode ser encontrado com numeros.length - 1."
    },
    {
      "id": "array-length",
      "type": "example",
      "eyebrow": "03 · TAMANHO",
      "title": "length mostra quantos itens existem",
      "body": "A propriedade length informa quantos valores existem no array. Ela também ajuda a montar o limite correto de um for.",
      "code": "const valores = [5, 8, 12];\n\nvalores.length; // 3\nvalores[valores.length - 1]; // 12",
      "explanation": "O tamanho é 3, mas o último índice é 2. Essa diferença entre quantidade e índice continua sendo importante nos arrays."
    },
    {
      "id": "array-change",
      "type": "example",
      "eyebrow": "04 · ALTERANDO",
      "title": "Uma posição pode receber outro valor",
      "body": "Arrays permitem alterar um item existente acessando sua posição e atribuindo um novo valor.",
      "code": "const numeros = [10, 20, 30];\n\nnumeros[1] = 99;\n\n// [10, 99, 30]",
      "explanation": "O valor da posição 1 foi substituído. A ordem dos outros itens continua igual."
    },
    {
      "id": "array-push",
      "type": "example",
      "eyebrow": "05 · ADICIONANDO",
      "title": "push adiciona um item no final",
      "body": "Quando você precisa colocar um novo valor no fim do array, pode usar push. Para remover o último, pop também existe.",
      "code": "const numeros = [10, 20];\n\nnumeros.push(30);\n// [10, 20, 30]\n\nnumeros.pop();\n// [10, 20]",
      "explanation": "push aumenta a lista adicionando um item no final. pop retira o último item. Nesta etapa, vamos focar nessas duas operações simples."
    },
    {
      "id": "array-loop",
      "type": "example",
      "eyebrow": "06 · PERCORRENDO",
      "title": "O mesmo for do N3 visita cada item",
      "body": "Você já sabe percorrer listas com índice e for. Agora esse conhecimento vira a principal ferramenta para trabalhar com arrays.",
      "code": "const valores = [4, 7, 2];\n\nfor (let i = 0; i < valores.length; i++) {\n  console.log(valores[i]);\n}",
      "explanation": "Comece em 0 e avance enquanto i for menor que length. Em cada volta, valores[i] representa o item daquela posição."
    },
    {
      "id": "array-search",
      "type": "example",
      "eyebrow": "07 · PROCURANDO",
      "title": "Percorrer também permite procurar",
      "body": "Uma busca pode verificar cada posição e retornar true assim que encontrar o valor desejado. Existe também o método includes como um atalho para essa pergunta.",
      "code": "const valores = [4, 7, 2];\nlet encontrado = false;\n\nfor (let i = 0; i < valores.length; i++) {\n  if (valores[i] === 7) {\n    encontrado = true;\n  }\n}\n\n// valores.includes(7) → true",
      "explanation": "O padrão manual reforça for e comparação. O includes resolve diretamente a pergunta “esse valor está na lista?”, mas entender o percurso continua sendo mais importante neste nível."
    },
    {
      "id": "array-build",
      "type": "example",
      "eyebrow": "08 · CONSTRUINDO",
      "title": "Você também pode criar uma nova lista",
      "body": "Comece com um array vazio e use push para colocar nele somente os valores que interessam.",
      "code": "const resultado = [];\n\nfor (let i = 0; i < valores.length; i++) {\n  if (valores[i] % 2 === 0) {\n    resultado.push(valores[i]);\n  }\n}",
      "explanation": "Esse padrão permite filtrar uma lista sem modificar a original: percorra, decida com if e adicione ao novo array apenas o que passou na regra."
    },
    {
      "id": "array-quiz",
      "type": "quiz",
      "eyebrow": "09 · TESTE RÁPIDO",
      "title": "Qual valor está nessa posição?",
      "body": "Observe o array e lembre que o índice começa em zero.",
      "quiz": {
        "question": "Qual valor será retornado por valores[1]?",
        "options": [
          "5",
          "8",
          "12",
          "3"
        ],
        "answer": 1,
        "explanation": "Em [5, 8, 12], o índice 0 guarda 5, o índice 1 guarda 8 e o índice 2 guarda 12."
      },
      "code": "const valores = [5, 8, 12];"
    },
    {
      "id": "ready",
      "type": "checkpoint",
      "eyebrow": "10 · VOCÊ ESTÁ PRONTO",
      "title": "Agora trabalhe com listas de verdade",
      "body": "Você já conhece arrays, índices, length, alteração, push, busca e o padrão de percorrer e construir novas listas. Agora vai aplicar isso em desafios que aumentam de dificuldade passo a passo.",
      "code": "function somarLista(valores) {\n  let total = 0;\n\n  // sua missão começa aqui\n}",
      "explanation": "A primeira missão é simples de propósito. Depois, você vai combinar arrays com contadores, acumuladores, comparações e construção de novas listas."
    }
  ]
};
