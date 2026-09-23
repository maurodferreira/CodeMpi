export interface LessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface LessonStep {
  id: string;
  type: 'concept' | 'example' | 'quiz' | 'checkpoint';
  eyebrow: string;
  title: string;
  body: string;
  code?: string;
  explanation?: string;
  quiz?: LessonQuiz;
}

export interface LevelLesson {
  levelTag: string;
  title: string;
  subtitle: string;
  rewardXp: number;
  steps: LessonStep[];
}

export const LEVEL_LESSONS: Record<number, LevelLesson> = {
  0: {
    levelTag: 'N1',
    title: 'Variáveis e Operadores',
    subtitle: 'Antes de escrever bastante código, vamos entender as peças que você vai usar.',
    rewardXp: 25,
    steps: [
      {
        id: 'variables',
        type: 'concept',
        eyebrow: '01 · CONCEITO',
        title: 'Seu programa precisa guardar informações',
        body: 'Variáveis são nomes que usamos para guardar valores. O valor pode mudar durante o programa. Pense nelas como pequenas caixas com nome.',
        code: 'let nome = "Mauro";\nlet idade = 20;\n\nidade = idade + 1;',
        explanation: 'Aqui, nome guarda um texto e idade guarda um número. O let cria uma variável que pode receber outro valor depois.',
      },
      {
        id: 'operators',
        type: 'example',
        eyebrow: '02 · NA PRÁTICA',
        title: 'Operadores permitem transformar valores',
        body: 'Os operadores são os símbolos que usamos para calcular e comparar valores. No começo, os quatro mais importantes são +, -, * e /.',
        code: 'let pontos = 100;\nlet bonus = 25;\n\nlet total = pontos + bonus;',
        explanation: 'Depois da última linha, total vale 125. O computador executa as operações e guarda o resultado em outra variável.',
      },
      {
        id: 'functions',
        type: 'example',
        eyebrow: '03 · UMA IDEIA NOVA',
        title: 'Funções recebem dados e devolvem resultados',
        body: 'Uma função agrupa uma tarefa. Os parâmetros são os valores que entram e return é o valor que sai.',
        code: 'function somar(a, b) {\n  return a + b;\n}\n\n// somar(2, 3) → 5',
        explanation: 'Neste curso você vai escrever muitas funções. Em cada missão, os testes chamam sua função e conferem o resultado.',
      },
      {
        id: 'operators-quiz',
        type: 'quiz',
        eyebrow: '04 · TESTE RÁPIDO',
        title: 'Hora de testar sua lógica',
        body: 'Não precisa ter medo de errar. Escolha uma opção; você pode tentar novamente quantas vezes precisar.',
        quiz: {
          question: 'Depois deste código, qual será o valor de total?',
          options: ['10', '15', '20', '25'],
          answer: 1,
          explanation: 'total começa em 10 e depois recebe 10 + 5. Portanto, o resultado é 15.',
        },
      },
      {
        id: 'ready',
        type: 'checkpoint',
        eyebrow: '05 · VOCÊ ESTÁ PRONTO',
        title: 'Agora é com você',
        body: 'Você já viu variáveis, operadores e funções. O primeiro desafio é pequeno de propósito: acertar a lógica básica antes de aumentar a dificuldade.',
        code: 'function somar(a, b) {\n  // sua primeira missão começa aqui\n}',
        explanation: 'Na missão, você poderá rodar os testes, ver exatamente o que passou e pedir pistas quando travar.',
      },
    ],
  },
  1: {
    levelTag: 'N2',
    title: 'Condicionais',
    subtitle: 'Agora o programa vai aprender a tomar decisões. Você vai ensinar o código a escolher caminhos.',
    rewardXp: 40,
    steps: [
      {
        id: 'if',
        type: 'concept',
        eyebrow: '01 · CONCEITO',
        title: 'Programas também tomam decisões',
        body: 'Uma condição permite que seu programa escolha o que fazer. Se algo for verdadeiro, um caminho acontece; caso contrário, outro caminho pode acontecer.',
        code: 'const idade = 20;\n\nif (idade >= 18) {\n  console.log("maior de idade");\n} else {\n  console.log("menor de idade");\n}',
        explanation: 'O if verifica uma condição. Se idade >= 18 for verdadeiro, o primeiro bloco roda. Caso contrário, o else entra em ação.',
      },
      {
        id: 'comparison',
        type: 'example',
        eyebrow: '02 · COMPARANDO',
        title: 'Comparações produzem verdadeiro ou falso',
        body: 'Operadores como >, <, >=, <=, === e !== permitem fazer perguntas ao programa.',
        code: '10 > 5     // true\n10 === 5   // false\n10 !== 5   // true',
        explanation: 'O resultado de uma comparação é um booleano: true ou false. É esse resultado que controla muitos ifs.',
      },
      {
        id: 'logic',
        type: 'example',
        eyebrow: '03 · COMBINANDO REGRAS',
        title: 'E e OU deixam as decisões mais poderosas',
        body: 'Use && quando todas as condições precisam ser verdadeiras. Use || quando pelo menos uma delas precisa ser verdadeira.',
        code: 'idade >= 18 && temDocumento\n\nvalor >= 200 || assinante',
        explanation: 'Esses operadores permitem transformar regras do mundo real em lógica que o programa consegue executar.',
      },
      {
        id: 'conditional-quiz',
        type: 'quiz',
        eyebrow: '04 · TESTE RÁPIDO',
        title: 'Qual caminho será escolhido?',
        body: 'Leia a condição com calma. Errar aqui faz parte do aprendizado.',
        quiz: {
          question: 'Se idade vale 16, qual mensagem o código imprime? if (idade >= 18) { "adulto" } else { "menor" }',
          options: ['adulto', 'menor', 'true', 'nada'],
          answer: 1,
          explanation: '16 >= 18 é falso. Por isso, o caminho do else é escolhido.',
        },
      },
      {
        id: 'ready',
        type: 'checkpoint',
        eyebrow: '05 · VOCÊ ESTÁ PRONTO',
        title: 'Agora ensine o programa a decidir',
        body: 'Você já conhece condições, comparações, && e ||. Agora vai transformar regras em funções que realmente tomam decisões.',
        code: 'function ehPar(n) {\n  // sua missão começa aqui\n}',
        explanation: 'Começaremos com uma decisão simples e, aos poucos, vamos combinar várias condições até chegar ao desafio final.',
      },
    ],
  },

};
