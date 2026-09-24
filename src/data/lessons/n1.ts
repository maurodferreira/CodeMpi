import type { LevelLesson } from '../contentTypes';

export const N1_LESSON: LevelLesson = {
  "levelTag": "N1",
  "title": "Variáveis e Operadores",
  "subtitle": "Antes de escrever bastante código, vamos entender as peças que você vai usar.",
  "rewardXp": 25,
  "steps": [
    {
      "id": "variables",
      "type": "concept",
      "eyebrow": "01 · CONCEITO",
      "title": "Seu programa precisa guardar informações",
      "body": "Variáveis são nomes que usamos para guardar valores. O valor pode mudar durante o programa. Pense nelas como pequenas caixas com nome.",
      "code": "let nome = \"Mauro\";\nlet idade = 20;\n\nidade = idade + 1;",
      "explanation": "Aqui, nome guarda um texto e idade guarda um número. O let cria uma variável que pode receber outro valor depois."
    },
    {
      "id": "operators",
      "type": "example",
      "eyebrow": "02 · NA PRÁTICA",
      "title": "Operadores permitem transformar valores",
      "body": "Os operadores são os símbolos que usamos para calcular e comparar valores. No começo, os quatro mais importantes são +, -, * e /.",
      "code": "let pontos = 100;\nlet bonus = 25;\n\nlet total = pontos + bonus;",
      "explanation": "Depois da última linha, total vale 125. O computador executa as operações e guarda o resultado em outra variável."
    },
    {
      "id": "functions",
      "type": "example",
      "eyebrow": "03 · UMA IDEIA NOVA",
      "title": "Funções recebem dados e devolvem resultados",
      "body": "Uma função agrupa uma tarefa. Os parâmetros são os valores que entram e return é o valor que sai.",
      "code": "function somar(a, b) {\n  return a + b;\n}\n\n// somar(2, 3) → 5",
      "explanation": "Neste curso você vai escrever muitas funções. Em cada missão, os testes chamam sua função e conferem o resultado."
    },
    {
      "id": "operators-quiz",
      "type": "quiz",
      "eyebrow": "04 · TESTE RÁPIDO",
      "title": "Hora de testar sua lógica",
      "body": "Não precisa ter medo de errar. Escolha uma opção; você pode tentar novamente quantas vezes precisar.",
      "quiz": {
        "question": "Depois deste código, qual será o valor de total?",
        "options": [
          "125",
          "100",
          "115",
          "150"
        ],
        "answer": 0,
        "explanation": "pontos vale 100, bonus vale 25 e total recebe a soma dos dois. Portanto, o resultado é 125."
      },
      "code": "let pontos = 100;\nlet bonus = 25;\n\nlet total = pontos + bonus;"
    },
    {
      "id": "ready",
      "type": "checkpoint",
      "eyebrow": "05 · VOCÊ ESTÁ PRONTO",
      "title": "Agora é com você",
      "body": "Você já viu variáveis, operadores e funções. O primeiro desafio é pequeno de propósito: acertar a lógica básica antes de aumentar a dificuldade.",
      "code": "function somar(a, b) {\n  // sua primeira missão começa aqui\n}",
      "explanation": "Na missão, você poderá rodar os testes, ver exatamente o que passou e pedir pistas quando travar."
    }
  ]
};
