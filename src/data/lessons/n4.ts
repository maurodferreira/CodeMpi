import type { LevelLesson } from '../contentTypes';

export const N4_LESSON: LevelLesson = {
  "levelTag": "N4",
  "title": "Strings",
  "subtitle": "Agora você vai trabalhar com textos: descobrir seu tamanho, acessar caracteres, transformar e analisar cada parte.",
  "rewardXp": 70,
  "steps": [
    {
      "id": "string-idea",
      "type": "concept",
      "eyebrow": "01 · CONCEITO",
      "title": "Texto também é um valor que seu programa pode manipular",
      "body": "Em JavaScript, uma string representa um texto. Ela pode ser guardada em uma variável, recebida como parâmetro e transformada por operações próprias de texto.",
      "code": "const nome = \"Mauro\";\n\n// \"Mauro\" é uma string",
      "explanation": "Strings ficam entre aspas. Assim como números, elas podem entrar em funções como valores e ser usadas para produzir novos resultados."
    },
    {
      "id": "string-length",
      "type": "example",
      "eyebrow": "02 · TAMANHO",
      "title": "length diz quantos caracteres existem",
      "body": "A propriedade length informa o tamanho da string. Ela também ajuda a descobrir até onde um índice pode ir.",
      "code": "const palavra = \"CodeMpi\";\n\npalavra.length; // 7",
      "explanation": "A primeira posição é 0 e o tamanho é 7. Por isso, o último índice válido é 6."
    },
    {
      "id": "string-index",
      "type": "example",
      "eyebrow": "03 · ÍNDICES",
      "title": "Cada caractere ocupa uma posição",
      "body": "Você pode acessar um caractere usando colchetes e sua posição. O índice começa em 0, assim como aconteceu com as listas no N3.",
      "code": "const palavra = \"CodeMpi\";\n\npalavra[0]; // \"C\"\npalavra[palavra.length - 1]; // \"i\"",
      "explanation": "Usar length - 1 encontra a última posição porque os índices começam em 0."
    },
    {
      "id": "string-methods",
      "type": "example",
      "eyebrow": "04 · TRANSFORMANDO",
      "title": "Strings têm operações próprias",
      "body": "Métodos como toUpperCase, toLowerCase e replaceAll permitem criar uma nova versão do texto ou substituir partes dele.",
      "code": "const nome = \"Mauro\";\n\nnome.toUpperCase(); // \"MAURO\"\nnome.toLowerCase(); // \"mauro\"\nnome.replaceAll(\"a\", \"@\"); // \"M@uro\"",
      "explanation": "Esses métodos devolvem uma nova string. No replaceAll, todas as ocorrências do trecho informado são substituídas."
    },
    {
      "id": "string-loop",
      "type": "example",
      "eyebrow": "05 · PERCORRENDO",
      "title": "O for do N3 também funciona com texto",
      "body": "Uma string pode ser percorrida caractere por caractere. Isso permite contar ocorrências, procurar padrões e construir um novo texto.",
      "code": "const palavra = \"casa\";\n\nfor (let i = 0; i < palavra.length; i++) {\n  console.log(palavra[i]);\n}",
      "explanation": "O mesmo padrão usado para percorrer listas no N3 aparece aqui: índice, length e for. A diferença é que cada posição contém um caractere."
    },
    {
      "id": "string-comparison",
      "type": "example",
      "eyebrow": "06 · COMPARANDO",
      "title": "Dois textos podem ser comparados exatamente",
      "body": "O operador === verifica se duas strings são exatamente iguais. Maiúsculas e minúsculas fazem diferença nessa comparação.",
      "code": "const a = \"CodeMpi\";\nconst b = \"CodeMpi\";\nconst c = \"codempi\";\n\na === b; // true\na === c; // false",
      "explanation": "A comparação é literal: \"CodeMpi\" e \"codempi\" não são a mesma string porque as letras maiúsculas e minúsculas são diferentes."
    },
    {
      "id": "string-quiz",
      "type": "quiz",
      "eyebrow": "07 · TESTE RÁPIDO",
      "title": "Qual caractere está nessa posição?",
      "body": "Observe o índice com atenção. Lembre que a contagem começa em zero.",
      "quiz": {
        "question": "Qual valor será retornado por palavra[2]?",
        "options": [
          "C",
          "o",
          "d",
          "e"
        ],
        "answer": 2,
        "explanation": "Em \"CodeMpi\", os índices são 0 = C, 1 = o, 2 = d e 3 = e."
      },
      "code": "const palavra = \"CodeMpi\";"
    },
    {
      "id": "ready",
      "type": "checkpoint",
      "eyebrow": "08 · VOCÊ ESTÁ PRONTO",
      "title": "Agora transforme e investigue textos",
      "body": "Você já conhece tamanho, índices, métodos básicos e o percurso caractere por caractere. As missões vão começar simples e terminar combinando essas ideias.",
      "code": "function primeiraLetra(texto) {\n  // sua missão começa aqui\n}",
      "explanation": "No N4, você vai transformar Strings em algo que o programa consegue analisar, modificar e comparar."
    }
  ]
};
