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

export function getConcept(conceptId?: string, fallback = 'Conceito'): ConceptDefinition {
  return conceptId && CONCEPTS[conceptId]
    ? CONCEPTS[conceptId]
    : {
        id: conceptId || 'unknown',
        name: fallback,
        description: '',
      };
}
