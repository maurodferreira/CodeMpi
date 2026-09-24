import type { ConceptReview } from './conceptReviews';

export type { ConceptReview };

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
