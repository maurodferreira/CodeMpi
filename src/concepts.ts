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
};

export function getConcept(conceptId?: string, fallback = 'Conceito') {
  return conceptId && CONCEPTS[conceptId] ? CONCEPTS[conceptId] : {
    id: conceptId || 'unknown',
    name: fallback,
    description: '',
  };
}
