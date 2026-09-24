import type { LevelLesson } from '../contentTypes';

export const N6_LESSON: LevelLesson = {
  "levelTag": "N6",
  "title": "Funções e Lógica",
  "subtitle": "Você já sabe escrever funções. Agora vai aprender a transformar funções pequenas em soluções organizadas, reutilizáveis e completas.",
  "rewardXp": 100,
  "steps": [
    {
      "id": "function-role",
      "type": "concept",
      "eyebrow": "01 · CONCEITO",
      "title": "Uma função representa uma tarefa",
      "body": "Uma função recebe dados, executa uma tarefa e pode devolver um resultado. Separar tarefas em funções menores ajuda a organizar o raciocínio.",
      "code": "function dobrar(n) {\n  return n * 2;\n}\n\ndobrar(5); // 10",
      "explanation": "O nome da função descreve a tarefa. O parâmetro n representa a entrada e return define o resultado que sai da função."
    },
    {
      "id": "function-parameters",
      "type": "example",
      "eyebrow": "02 · ENTRADAS",
      "title": "Parâmetros tornam a função reutilizável",
      "body": "Uma mesma função pode trabalhar com muitos valores diferentes porque os dados entram pelos parâmetros. Quando uma taxa é dada em porcentagem, dividir por 100 transforma a porcentagem em sua parte do valor.",
      "code": "function precoComTaxa(valor, taxa) {\n  return valor + valor * taxa / 100;\n}\n\nprecoComTaxa(100, 10); // 110\nprecoComTaxa(80, 25); // 100",
      "explanation": "A função não depende de um número fixo. Ela recebe valor e taxa a cada chamada. Em uma taxa de 10%, por exemplo, taxa / 100 vale 0.10."
    },
    {
      "id": "local-variables",
      "type": "example",
      "eyebrow": "03 · ORGANIZANDO",
      "title": "Variáveis locais quebram um problema em etapas",
      "body": "Dentro de uma função, você pode criar variáveis para guardar resultados intermediários. Isso deixa cálculos maiores mais fáceis de acompanhar.",
      "code": "function montanteJuros(principal, taxa, meses) {\n  const juros = principal * taxa * meses / 100;\n  const montante = principal + juros;\n\n  return montante;\n}",
      "explanation": "juros e montante existem para essa execução da função. Variáveis locais ajudam você a nomear cada etapa sem misturar todas as operações em uma linha."
    },
    {
      "id": "multiple-returns",
      "type": "example",
      "eyebrow": "04 · CAMINHOS",
      "title": "Uma função pode ter mais de um caminho de retorno",
      "body": "Condições podem escolher respostas diferentes. Assim que uma regra definitiva for atendida, a função pode retornar e encerrar sua execução.",
      "code": "function classificarNota(nota) {\n  if (nota < 0 || nota > 10) return \"invalida\";\n  if (nota < 5) return \"reprovado\";\n  if (nota < 7) return \"recuperacao\";\n  return \"aprovado\";\n}",
      "explanation": "Cada return encerra a função naquele caminho. A ordem das condições importa porque o programa verifica as regras de cima para baixo."
    },
    {
      "id": "boolean-functions",
      "type": "example",
      "eyebrow": "05 · PERGUNTAS",
      "title": "Funções também podem responder com true ou false",
      "body": "Uma função booleana transforma uma regra em uma pergunta reutilizável. Isso permite usar a mesma decisão em vários lugares.",
      "code": "function estaNoIntervalo(numero, minimo, maximo) {\n  return numero >= minimo && numero <= maximo;\n}\n\nestaNoIntervalo(5, 0, 10); // true",
      "explanation": "O resultado é um booleano. Funções desse tipo são úteis para validar dados e controlar outros caminhos do programa."
    },
    {
      "id": "validation",
      "type": "example",
      "eyebrow": "06 · VALIDANDO",
      "title": "Valide a entrada antes de continuar",
      "body": "Nem todo valor recebido por uma função é válido. Uma validação verifica as regras de entrada antes de executar as etapas que dependem dela.",
      "code": "function notaValida(nota) {\n  return nota >= 0 && nota <= 10;\n}\n\nnotaValida(8);  // true\nnotaValida(12); // false",
      "explanation": "A validação não calcula o resultado final. Ela responde primeiro se a entrada está dentro do contrato esperado."
    },
    {
      "id": "early-return",
      "type": "example",
      "eyebrow": "07 · RETORNO ANTECIPADO",
      "title": "Resolva casos definitivos cedo",
      "body": "Quando uma condição já determina a resposta, um return antecipado evita blocos desnecessários e deixa a lógica mais clara.",
      "code": "function classificarNota(nota) {\n  if (nota < 0 || nota > 10) return \"invalida\";\n\n  if (nota < 7) return \"reprovado\";\n  return \"aprovado\";\n}",
      "explanation": "Depois que uma nota inválida é encontrada, não faz sentido continuar classificando-a. O retorno antecipado encerra a função naquele ponto."
    },
    {
      "id": "sequential-state",
      "type": "example",
      "eyebrow": "08 · PENSANDO EM SEQUÊNCIA",
      "title": "Alguns problemas precisam atualizar mais de um valor",
      "body": "Nem todo laço usa um único acumulador. Em sequências como Fibonacci, duas informações dependem uma da outra e avançam a cada repetição.",
      "code": "let anterior = 0;\nlet atual = 1;\n\nfor (let i = 2; i <= 6; i++) {\n  const proximo = anterior + atual;\n  anterior = atual;\n  atual = proximo;\n}\n\n// atual vale 8",
      "explanation": "Em cada volta, o valor atual vira o anterior e um novo valor é calculado. Esse padrão prepara você para problemas em que mais de um estado precisa ser atualizado."
    },
    {
      "id": "composition",
      "type": "example",
      "eyebrow": "09 · COMPOSIÇÃO",
      "title": "Funções menores podem trabalhar juntas",
      "body": "Um problema maior pode ser dividido em funções auxiliares. Uma função pode chamar outra, reaproveitando uma tarefa que já foi resolvida.",
      "code": "function dobro(n) {\n  return n * 2;\n}\n\nfunction combinar(n) {\n  const valorDobrado = dobro(n);\n  return valorDobrado + n;\n}\n\ncombinar(5); // 15",
      "explanation": "combinar não precisa repetir a fórmula de dobro. Ela chama dobro, recebe o resultado e usa esse valor na próxima etapa."
    },
    {
      "id": "function-quiz",
      "type": "quiz",
      "eyebrow": "10 · TESTE RÁPIDO",
      "title": "Qual resultado sai da composição?",
      "body": "Acompanhe a chamada da função auxiliar e depois veja como o resultado é usado pela função principal.",
      "quiz": {
        "question": "Qual valor será retornado por combinar(5)?",
        "options": [
          "5",
          "10",
          "15",
          "25"
        ],
        "answer": 2,
        "explanation": "dobro(5) retorna 10. A função combinar soma esse resultado ao próprio 5, chegando a 15."
      },
      "code": "function dobro(n) {\n  return n * 2;\n}\n\nfunction combinar(n) {\n  const valorDobrado = dobro(n);\n  return valorDobrado + n;\n}"
    },
    {
      "id": "ready",
      "type": "checkpoint",
      "eyebrow": "11 · VOCÊ ESTÁ PRONTO",
      "title": "Agora transforme funções em soluções completas",
      "body": "Você já sabe receber parâmetros, usar variáveis locais, validar entradas, retornar cedo, atualizar estado em uma sequência e reutilizar funções auxiliares. As missões agora vão combinar esses padrões com loops, arrays, cálculos e regras.",
      "code": "function totalComTaxa(valores, taxa) {\n  // use uma função auxiliar para dividir o problema\n}",
      "explanation": "N6 não é sobre decorar mais uma sintaxe. É sobre aprender a dividir um problema, nomear suas etapas e reaproveitar soluções menores."
    }
  ]
};
