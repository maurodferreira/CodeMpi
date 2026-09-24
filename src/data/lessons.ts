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
          options: ['125', '100', '115', '150'],
          answer: 0,
          explanation: 'pontos vale 100, bonus vale 25 e total recebe a soma dos dois. Portanto, o resultado é 125.',
        },
        code: 'let pontos = 100;\nlet bonus = 25;\n\nlet total = pontos + bonus;',
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
          question: 'Se idade vale 16, qual mensagem será impressa?',
          options: ['adulto', 'true', 'menor', 'nada'],
          answer: 2,
          explanation: '16 >= 18 é falso. Por isso, o else executa e o programa imprime "menor".',
        },
        code: 'const idade = 16;\n\nif (idade >= 18) {\n  console.log("adulto");\n} else {\n  console.log("menor");\n}',
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

  2: {
    levelTag: 'N3',
    title: 'Loops',
    subtitle: 'Agora você vai fazer o programa repetir uma tarefa e construir resultados aos poucos.',
    rewardXp: 55,
    steps: [
      {
        id: 'loop-idea',
        type: 'concept',
        eyebrow: '01 · CONCEITO',
        title: 'Repita sem copiar o mesmo código',
        body: 'Um laço de repetição executa um bloco várias vezes. Em vez de escrever a mesma instrução dez vezes, você ensina ao computador como avançar de uma etapa para a próxima.',
        code: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
        explanation: 'O for começa com i = 1, continua enquanto i <= 5 e aumenta i em 1 a cada volta. Assim, o bloco roda cinco vezes.',
      },
      {
        id: 'loop-counter',
        type: 'example',
        eyebrow: '02 · CONTANDO',
        title: 'Um contador guarda quantas vezes algo aconteceu',
        body: 'Você pode começar uma variável em zero e aumentá-la quando uma condição for atendida. Esse padrão aparece em contagens, filtros e estatísticas.',
        code: 'let quantidade = 0;\n\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) {\n    quantidade++;\n  }\n}\n\nreturn quantidade;',
        explanation: 'A variável quantidade é um contador. Ela só muda quando encontra um número par.',
      },
      {
        id: 'loop-accumulator',
        type: 'example',
        eyebrow: '03 · ACUMULANDO',
        title: 'Um acumulador constrói o resultado aos poucos',
        body: 'Quando o objetivo é somar ou multiplicar vários valores, use uma variável que recebe o resultado da volta anterior.',
        code: 'let total = 0;\n\nfor (let i = 1; i <= 5; i++) {\n  total += i;\n}\n\nreturn total;',
        explanation: 'Depois de cada volta, total guarda uma soma maior: 1, depois 3, depois 6, depois 10 e finalmente 15.',
      },
      {
        id: 'loop-list',
        type: 'example',
        eyebrow: '04 · PERCORRENDO',
        title: 'Uma lista pode ser visitada item por item',
        body: 'Quando uma lista já vem pronta, um índice permite acessar cada posição. Neste nível, o foco é aprender a repetição; os métodos de arrays ficam para uma etapa futura.',
        code: 'let total = 0;\n\nfor (let i = 0; i < valores.length; i++) {\n  total += valores[i];\n}\n\nreturn total;',
        explanation: 'O índice começa em 0 porque a primeira posição da lista é valores[0]. A cada volta, ele avança até a última posição.',
      },
      {
        id: 'loop-quiz',
        type: 'quiz',
        eyebrow: '05 · TESTE RÁPIDO',
        title: 'Quantas vezes esse laço roda?',
        body: 'Leia a condição do for com calma e acompanhe o valor de i.',
        quiz: {
          question: 'Quantas vezes o bloco abaixo será executado?',
          options: ['3 vezes', '4 vezes', '5 vezes', 'Infinitamente'],
          answer: 1,
          explanation: 'i assume os valores 1, 2, 3 e 4. Quando chega a 5, a condição i <= 4 deixa de ser verdadeira.',
        },
        code: 'for (let i = 1; i <= 4; i++) {\n  console.log(i);\n}',
      },
      {
        id: 'ready',
        type: 'checkpoint',
        eyebrow: '06 · VOCÊ ESTÁ PRONTO',
        title: 'Agora faça o programa repetir',
        body: 'Você já conhece a estrutura do for, contadores, acumuladores e o percurso básico de uma lista. Agora vai usar tudo isso em desafios cada vez mais interessantes.',
        code: 'function somaAte(n) {\n  let total = 0;\n\n  // sua missão começa aqui\n}',
        explanation: 'Começaremos com um laço simples e terminaremos combinando repetição, comparação e dados de uma lista.',
      },
    ],
  },
  3: {
    levelTag: 'N4',
    title: 'Strings',
    subtitle: 'Agora você vai trabalhar com textos: descobrir seu tamanho, acessar caracteres, transformar e analisar cada parte.',
    rewardXp: 70,
    steps: [
      {
        id: 'string-idea',
        type: 'concept',
        eyebrow: '01 · CONCEITO',
        title: 'Texto também é um valor que seu programa pode manipular',
        body: 'Em JavaScript, uma string representa um texto. Ela pode ser guardada em uma variável, recebida como parâmetro e transformada por operações próprias de texto.',
        code: 'const nome = "Mauro";\n\n// "Mauro" é uma string',
        explanation: 'Strings ficam entre aspas. Assim como números, elas podem entrar em funções como valores e ser usadas para produzir novos resultados.',
      },
      {
        id: 'string-length',
        type: 'example',
        eyebrow: '02 · TAMANHO',
        title: 'length diz quantos caracteres existem',
        body: 'A propriedade length informa o tamanho da string. Ela também ajuda a descobrir até onde um índice pode ir.',
        code: 'const palavra = "CodeMpi";\n\npalavra.length; // 7',
        explanation: 'A primeira posição é 0 e o tamanho é 7. Por isso, o último índice válido é 6.',
      },
      {
        id: 'string-index',
        type: 'example',
        eyebrow: '03 · ÍNDICES',
        title: 'Cada caractere ocupa uma posição',
        body: 'Você pode acessar um caractere usando colchetes e sua posição. O índice começa em 0, assim como aconteceu com as listas no N3.',
        code: 'const palavra = "CodeMpi";\n\npalavra[0]; // "C"\npalavra[palavra.length - 1]; // "i"',
        explanation: 'Usar length - 1 encontra a última posição porque os índices começam em 0.',
      },
      {
        id: 'string-methods',
        type: 'example',
        eyebrow: '04 · TRANSFORMANDO',
        title: 'Strings têm operações próprias',
        body: 'Métodos como toUpperCase, toLowerCase e replaceAll permitem criar uma nova versão do texto ou substituir partes dele.',
        code: 'const nome = "Mauro";\n\nnome.toUpperCase(); // "MAURO"\nnome.toLowerCase(); // "mauro"\nnome.replaceAll("a", "@"); // "M@uro"',
        explanation: 'Esses métodos devolvem uma nova string. No replaceAll, todas as ocorrências do trecho informado são substituídas.',
      },
      {
        id: 'string-loop',
        type: 'example',
        eyebrow: '05 · PERCORRENDO',
        title: 'O for do N3 também funciona com texto',
        body: 'Uma string pode ser percorrida caractere por caractere. Isso permite contar ocorrências, procurar padrões e construir um novo texto.',
        code: 'const palavra = "casa";\n\nfor (let i = 0; i < palavra.length; i++) {\n  console.log(palavra[i]);\n}',
        explanation: 'O mesmo padrão usado para percorrer listas no N3 aparece aqui: índice, length e for. A diferença é que cada posição contém um caractere.',
      },
      {
        id: 'string-comparison',
        type: 'example',
        eyebrow: '06 · COMPARANDO',
        title: 'Dois textos podem ser comparados exatamente',
        body: 'O operador === verifica se duas strings são exatamente iguais. Maiúsculas e minúsculas fazem diferença nessa comparação.',
        code: 'const a = "CodeMpi";\nconst b = "CodeMpi";\nconst c = "codempi";\n\na === b; // true\na === c; // false',
        explanation: 'A comparação é literal: "CodeMpi" e "codempi" não são a mesma string porque as letras maiúsculas e minúsculas são diferentes.',
      },
      {
        id: 'string-quiz',
        type: 'quiz',
        eyebrow: '07 · TESTE RÁPIDO',
        title: 'Qual caractere está nessa posição?',
        body: 'Observe o índice com atenção. Lembre que a contagem começa em zero.',
        quiz: {
          question: 'Qual valor será retornado por palavra[2]?',
          options: ['C', 'o', 'd', 'e'],
          answer: 2,
          explanation: 'Em "CodeMpi", os índices são 0 = C, 1 = o, 2 = d e 3 = e.',
        },
        code: 'const palavra = "CodeMpi";',
      },
      {
        id: 'ready',
        type: 'checkpoint',
        eyebrow: '08 · VOCÊ ESTÁ PRONTO',
        title: 'Agora transforme e investigue textos',
        body: 'Você já conhece tamanho, índices, métodos básicos e o percurso caractere por caractere. As missões vão começar simples e terminar combinando essas ideias.',
        code: 'function primeiraLetra(texto) {\n  // sua missão começa aqui\n}',
        explanation: 'No N4, você vai transformar Strings em algo que o programa consegue analisar, modificar e comparar.',
      },
    ],
  }
};
