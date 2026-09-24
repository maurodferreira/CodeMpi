export interface ConceptDefinition {
  id: string;
  name: string;
  description: string;
}

export const CONCEPTS: Record<string, ConceptDefinition> = {
  variables: {
    id: 'variables',
    name: 'Variáveis',
    description: 'Guardar e atualizar valores usando variáveis.',
  },
  return: {
    id: 'return',
    name: 'Return e valores',
    description: 'Fazer uma função devolver um resultado.',
  },
  addition: {
    id: 'addition',
    name: 'Soma',
    description: 'Usar o operador + para combinar valores.',
  },
  subtraction: {
    id: 'subtraction',
    name: 'Subtração',
    description: 'Usar o operador - para calcular diferenças.',
  },
  multiplication: {
    id: 'multiplication',
    name: 'Multiplicação',
    description: 'Usar o operador * para multiplicar valores.',
  },
  division: {
    id: 'division',
    name: 'Divisão',
    description: 'Usar o operador / para dividir valores.',
  },
  remainder: {
    id: 'remainder',
    name: 'Resto da divisão',
    description: 'Usar o operador % para encontrar o restante de uma divisão.',
  },
  expressions: {
    id: 'expressions',
    name: 'Expressões matemáticas',
    description: 'Combinar operações em uma expressão.',
  },
  conditionals: {
    id: 'conditionals',
    name: 'Condicionais',
    description: 'Fazer o programa tomar decisões com if e else.',
  },
  comparisons: {
    id: 'comparisons',
    name: 'Comparações',
    description: 'Comparar valores com operadores como >, <, >= e ===.',
  },
  booleanLogic: {
    id: 'booleanLogic',
    name: 'Lógica booleana',
    description: 'Combinar condições usando && e ||.',
  },
  loops: {
    id: 'loops',
    name: 'Laços de repetição',
    description: 'Repetir uma tarefa com for ou while sem duplicar código.',
  },
  counters: {
    id: 'counters',
    name: 'Contadores',
    description: 'Usar uma variável para contar quantas vezes algo acontece.',
  },
  accumulators: {
    id: 'accumulators',
    name: 'Acumuladores',
    description: 'Construir um resultado aos poucos dentro de um laço.',
  },
  iteration: {
    id: 'iteration',
    name: 'Percorrer listas',
    description: 'Visitar os valores de uma lista usando um índice e um laço.',
  },
};



export interface ConceptReview {
  question: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const CONCEPT_REVIEWS: Record<string, ConceptReview> = {
  return: {
    question: 'O que a função deve devolver quando somar(2, 3) é chamada?',
    code: 'function somar(a, b) {\n  return a + b;\n}',
    options: ['2', '3', '5', '6'],
    answer: 2,
    explanation: 'return entrega o resultado da expressão. Como 2 + 3 = 5, a função devolve 5.',
  },
  addition: {
    question: 'Qual será o resultado de 12 + 8?',
    options: ['18', '20', '21', '24'],
    answer: 1,
    explanation: 'O operador + soma os dois valores: 12 + 8 = 20.',
  },
  subtraction: {
    question: 'Qual será o resultado de 10 - 14?',
    options: ['4', '-4', '-24', '24'],
    answer: 1,
    explanation: 'A subtração acontece na ordem apresentada: 10 - 14 = -4.',
  },
  multiplication: {
    question: 'Qual será o resultado de 6 * 4?',
    options: ['10', '18', '24', '28'],
    answer: 2,
    explanation: 'O operador * multiplica os valores: 6 × 4 = 24.',
  },
  division: {
    question: 'Qual será o resultado de 7 / 2?',
    options: ['2', '3', '3.5', '4'],
    answer: 2,
    explanation: 'Em JavaScript, a divisão pode resultar em decimal. 7 / 2 = 3.5.',
  },
  remainder: {
    question: 'Qual será o resultado de 10 % 3?',
    options: ['0', '1', '2', '3'],
    answer: 1,
    explanation: 'O operador % devolve o que sobra da divisão. Na divisão de 10 por 3, sobra 1.',
  },
  expressions: {
    question: 'Qual será o resultado de (4 + 2) * 3?',
    options: ['10', '12', '18', '24'],
    answer: 2,
    explanation: 'Os parênteses são resolvidos primeiro: 4 + 2 = 6. Depois, 6 * 3 = 18.',
  },
  conditionals: {
    question: 'Com idade = 16, qual caminho do if/else será executado?',
    code: 'if (idade >= 18) {\n  return "adulto";\n} else {\n  return "menor";\n}',
    options: ['O if', 'O else', 'Os dois', 'Nenhum'],
    answer: 1,
    explanation: '16 >= 18 é falso, então o programa segue o caminho do else.',
  },
  comparisons: {
    question: 'Qual é o resultado de 18 >= 18?',
    options: ['true', 'false', '18', 'undefined'],
    answer: 0,
    explanation: '>= significa “maior ou igual”. Como 18 é igual a 18, o resultado é true.',
  },
  booleanLogic: {
    question: 'Qual será o resultado de true && false?',
    options: ['true', 'false', 'null', 'undefined'],
    answer: 1,
    explanation: '&& só resulta em true quando as duas condições são verdadeiras. Aqui uma delas é false.',
  },
  loops: {
    question: 'Quantas vezes o bloco será executado?',
    code: 'for (let i = 1; i <= 4; i++) {\n  console.log(i);\n}',
    options: ['3 vezes', '4 vezes', '5 vezes', 'Infinitamente'],
    answer: 1,
    explanation: 'i assume 1, 2, 3 e 4. Quando chega a 5, a condição deixa de ser verdadeira.',
  },
  counters: {
    question: 'Se quantidade começa em 0 e recebe +1 três vezes, qual será o valor final?',
    code: 'let quantidade = 0;\nquantidade++;\nquantidade++;\nquantidade++;',
    options: ['0', '1', '2', '3'],
    answer: 3,
    explanation: 'Cada ++ aumenta a variável em 1. Depois de três incrementos, quantidade vale 3.',
  },
  accumulators: {
    question: 'Depois do laço, qual será o valor de total?',
    code: 'let total = 0;\n\nfor (let i = 1; i <= 4; i++) {\n  total += i;\n}',
    options: ['4', '8', '10', '12'],
    answer: 2,
    explanation: 'O acumulador soma 1 + 2 + 3 + 4, chegando ao total de 10.',
  },
  iteration: {
    question: 'Qual valor está em valores[1] nesta lista?',
    code: 'const valores = [10, 20, 30];',
    options: ['10', '20', '30', '1'],
    answer: 1,
    explanation: 'Os índices começam em 0. Assim, valores[0] é 10 e valores[1] é 20.',
  },
};

export function getConceptReview(conceptId: string): ConceptReview | null {
  return CONCEPT_REVIEWS[conceptId] || null;
}


export interface ConceptLearningGuidance {
  focus: string;
  reflection: string;
}

export const CONCEPT_LEARNING_GUIDANCE: Record<string, ConceptLearningGuidance> = {
  return: {
    focus: 'A assinatura da função define o que entra; confirme qual valor precisa sair dela pelo return.',
    reflection: 'Qual valor esta função precisa devolver para cumprir exatamente o contrato da missão?',
  },
  addition: {
    focus: 'Observe quais valores realmente precisam contribuir para o resultado e qual operação combina com essa relação.',
    reflection: 'Quais valores entram na soma e como você consegue conferir o resultado antes de rodar?',
  },
  subtraction: {
    focus: 'A ordem dos operandos importa. Compare o enunciado com a ordem em que os valores estão sendo usados.',
    reflection: 'Qual valor está sendo diminuído de qual?',
  },
  multiplication: {
    focus: 'Pense na relação entre entrada e saída antes de escolher a operação. O resultado cresce quantas vezes em relação ao valor recebido?',
    reflection: 'Que relação matemática o resultado precisa ter com a entrada?',
  },
  division: {
    focus: 'Observe divisor e dividendo e lembre que a divisão em JavaScript pode produzir um resultado decimal.',
    reflection: 'Qual valor divide qual, e o resultado pode ter casas decimais?',
  },
  remainder: {
    focus: 'Aqui, o objetivo não é descobrir o quociente, mas o que sobra depois da divisão.',
    reflection: 'O enunciado quer o resultado da divisão ou apenas o que ficou sobrando?',
  },
  expressions: {
    focus: 'Resolva a expressão por etapas e confira a prioridade de parênteses e operações antes de comparar o resultado.',
    reflection: 'Qual parte da expressão deve ser resolvida primeiro?',
  },
  conditionals: {
    focus: 'Separe mentalmente os casos possíveis e confira qual condição decide cada caminho do if/else.',
    reflection: 'Quais casos existem e qual condição separa um caso do outro?',
  },
  comparisons: {
    focus: 'Leia o operador como uma frase e compare essa frase com o que o enunciado está pedindo.',
    reflection: 'A regra pede maior, menor, igual ou uma combinação dessas relações?',
  },
  booleanLogic: {
    focus: 'Descubra se a regra exige que todas as condições sejam verdadeiras ou se basta uma delas.',
    reflection: 'A regra precisa de todas as condições ou de apenas uma?',
  },
  loops: {
    focus: 'Confira as três partes do laço: onde começa, enquanto qual condição continua e o que muda a cada repetição.',
    reflection: 'Quando o laço começa, quando ele para e o que muda entre uma volta e outra?',
  },
  counters: {
    focus: 'Um contador só deve aumentar quando o evento que você quer contar realmente acontece.',
    reflection: 'Qual acontecimento deve fazer seu contador aumentar?',
  },
  accumulators: {
    focus: 'Pense no valor inicial e no que entra no resultado a cada repetição. O acumulador cresce passo a passo.',
    reflection: 'O que deve ser acrescentado ao resultado em cada volta do laço?',
  },
  iteration: {
    focus: 'Confira se o percurso visita os itens certos, começando no índice correto e sem ultrapassar o tamanho da lista.',
    reflection: 'Quais índices precisam ser visitados para nenhum item ficar de fora?',
  },
};

export function getConceptLearningGuidance(conceptId?: string): ConceptLearningGuidance | null {
  return conceptId ? CONCEPT_LEARNING_GUIDANCE[conceptId] || null : null;
}

export function getConcept(conceptId?: string, fallback = 'Conceito') {
  return conceptId && CONCEPTS[conceptId] ? CONCEPTS[conceptId] : {
    id: conceptId || 'unknown',
    name: fallback,
    description: '',
  };
}
