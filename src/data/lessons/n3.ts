import type { LevelLesson } from '../contentTypes';

export const N3_LESSON: LevelLesson = {
  "levelTag": "N3",
  "title": "Loops",
  "subtitle": "Agora você vai fazer o programa repetir uma tarefa e construir resultados aos poucos.",
  "rewardXp": 55,
  "steps": [
    {
      "id": "loop-idea",
      "type": "concept",
      "eyebrow": "01 · CONCEITO",
      "title": "Repita sem copiar o mesmo código",
      "body": "Um laço de repetição executa um bloco várias vezes. Em vez de escrever a mesma instrução dez vezes, você ensina ao computador como avançar de uma etapa para a próxima.",
      "code": "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}",
      "explanation": "O for começa com i = 1, continua enquanto i <= 5 e aumenta i em 1 a cada volta. Assim, o bloco roda cinco vezes."
    },
    {
      "id": "loop-counter",
      "type": "example",
      "eyebrow": "02 · CONTANDO",
      "title": "Um contador guarda quantas vezes algo aconteceu",
      "body": "Você pode começar uma variável em zero e aumentá-la quando uma condição for atendida. Esse padrão aparece em contagens, filtros e estatísticas.",
      "code": "let quantidade = 0;\n\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) {\n    quantidade++;\n  }\n}\n\nreturn quantidade;",
      "explanation": "A variável quantidade é um contador. Ela só muda quando encontra um número par."
    },
    {
      "id": "loop-accumulator",
      "type": "example",
      "eyebrow": "03 · ACUMULANDO",
      "title": "Um acumulador constrói o resultado aos poucos",
      "body": "Quando o objetivo é somar ou multiplicar vários valores, use uma variável que recebe o resultado da volta anterior.",
      "code": "let total = 0;\n\nfor (let i = 1; i <= 5; i++) {\n  total += i;\n}\n\nreturn total;",
      "explanation": "Depois de cada volta, total guarda uma soma maior: 1, depois 3, depois 6, depois 10 e finalmente 15."
    },
    {
      "id": "loop-list",
      "type": "example",
      "eyebrow": "04 · PERCORRENDO",
      "title": "Uma lista pode ser visitada item por item",
      "body": "Quando uma lista já vem pronta, um índice permite acessar cada posição. Neste nível, o foco é aprender a repetição; os métodos de arrays ficam para uma etapa futura.",
      "code": "let total = 0;\n\nfor (let i = 0; i < valores.length; i++) {\n  total += valores[i];\n}\n\nreturn total;",
      "explanation": "O índice começa em 0 porque a primeira posição da lista é valores[0]. A cada volta, ele avança até a última posição."
    },
    {
      "id": "loop-quiz",
      "type": "quiz",
      "eyebrow": "05 · TESTE RÁPIDO",
      "title": "Quantas vezes esse laço roda?",
      "body": "Leia a condição do for com calma e acompanhe o valor de i.",
      "quiz": {
        "question": "Quantas vezes o bloco abaixo será executado?",
        "options": [
          "3 vezes",
          "4 vezes",
          "5 vezes",
          "Infinitamente"
        ],
        "answer": 1,
        "explanation": "i assume os valores 1, 2, 3 e 4. Quando chega a 5, a condição i <= 4 deixa de ser verdadeira."
      },
      "code": "for (let i = 1; i <= 4; i++) {\n  console.log(i);\n}"
    },
    {
      "id": "ready",
      "type": "checkpoint",
      "eyebrow": "06 · VOCÊ ESTÁ PRONTO",
      "title": "Agora faça o programa repetir",
      "body": "Você já conhece a estrutura do for, contadores, acumuladores e o percurso básico de uma lista. Agora vai usar tudo isso em desafios cada vez mais interessantes.",
      "code": "function somaAte(n) {\n  let total = 0;\n\n  // sua missão começa aqui\n}",
      "explanation": "Começaremos com um laço simples e terminaremos combinando repetição, comparação e dados de uma lista."
    }
  ]
};
