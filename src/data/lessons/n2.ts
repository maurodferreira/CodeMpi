import type { LevelLesson } from '../contentTypes';

export const N2_LESSON: LevelLesson = {
  "levelTag": "N2",
  "title": "Condicionais",
  "subtitle": "Agora o programa vai aprender a tomar decisões. Você vai ensinar o código a escolher caminhos.",
  "rewardXp": 40,
  "steps": [
    {
      "id": "if",
      "type": "concept",
      "eyebrow": "01 · CONCEITO",
      "title": "Programas também tomam decisões",
      "body": "Uma condição permite que seu programa escolha o que fazer. Se algo for verdadeiro, um caminho acontece; caso contrário, outro caminho pode acontecer.",
      "code": "const idade = 20;\n\nif (idade >= 18) {\n  console.log(\"maior de idade\");\n} else {\n  console.log(\"menor de idade\");\n}",
      "explanation": "O if verifica uma condição. Se idade >= 18 for verdadeiro, o primeiro bloco roda. Caso contrário, o else entra em ação."
    },
    {
      "id": "comparison",
      "type": "example",
      "eyebrow": "02 · COMPARANDO",
      "title": "Comparações produzem verdadeiro ou falso",
      "body": "Operadores como >, <, >=, <=, === e !== permitem fazer perguntas ao programa.",
      "code": "10 > 5     // true\n10 === 5   // false\n10 !== 5   // true",
      "explanation": "O resultado de uma comparação é um booleano: true ou false. É esse resultado que controla muitos ifs."
    },
    {
      "id": "logic",
      "type": "example",
      "eyebrow": "03 · COMBINANDO REGRAS",
      "title": "E e OU deixam as decisões mais poderosas",
      "body": "Use && quando todas as condições precisam ser verdadeiras. Use || quando pelo menos uma delas precisa ser verdadeira.",
      "code": "idade >= 18 && temDocumento\n\nvalor >= 200 || assinante",
      "explanation": "Esses operadores permitem transformar regras do mundo real em lógica que o programa consegue executar."
    },
    {
      "id": "conditional-quiz",
      "type": "quiz",
      "eyebrow": "04 · TESTE RÁPIDO",
      "title": "Qual caminho será escolhido?",
      "body": "Leia a condição com calma. Errar aqui faz parte do aprendizado.",
      "quiz": {
        "question": "Se idade vale 16, qual mensagem será impressa?",
        "options": [
          "adulto",
          "true",
          "menor",
          "nada"
        ],
        "answer": 2,
        "explanation": "16 >= 18 é falso. Por isso, o else executa e o programa imprime \"menor\"."
      },
      "code": "const idade = 16;\n\nif (idade >= 18) {\n  console.log(\"adulto\");\n} else {\n  console.log(\"menor\");\n}"
    },
    {
      "id": "ready",
      "type": "checkpoint",
      "eyebrow": "05 · VOCÊ ESTÁ PRONTO",
      "title": "Agora ensine o programa a decidir",
      "body": "Você já conhece condições, comparações, && e ||. Agora vai transformar regras em funções que realmente tomam decisões.",
      "code": "function ehPar(n) {\n  // sua missão começa aqui\n}",
      "explanation": "Começaremos com uma decisão simples e, aos poucos, vamos combinar várias condições até chegar ao desafio final."
    }
  ]
};
