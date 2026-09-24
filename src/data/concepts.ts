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
  strings: {
    id: 'strings',
    name: 'Strings',
    description: 'Trabalhar com textos e acessar seus caracteres.',
  },
  stringLength: {
    id: 'stringLength',
    name: 'Tamanho de strings',
    description: 'Usar length para descobrir quantos caracteres uma string possui.',
  },
  stringIndex: {
    id: 'stringIndex',
    name: 'Índices de strings',
    description: 'Acessar caracteres de uma string usando posições e índices.',
  },
  stringCase: {
    id: 'stringCase',
    name: 'Maiúsculas e minúsculas',
    description: 'Transformar o texto usando toUpperCase e toLowerCase.',
  },
  stringIteration: {
    id: 'stringIteration',
    name: 'Percorrer strings',
    description: 'Visitar caracteres de uma string usando um laço e um índice.',
  },
  stringReplacement: {
    id: 'stringReplacement',
    name: 'Substituição de texto',
    description: 'Substituir ocorrências de texto dentro de uma string.',
  },
  stringComparison: {
    id: 'stringComparison',
    name: 'Comparação de strings',
    description: 'Comparar textos usando igualdade exata.',
  },
  palindrome: {
    id: 'palindrome',
    name: 'Palíndromos',
    description: 'Identificar textos que permanecem iguais quando lidos de trás para frente.',
  },
  arrays: {
    id: 'arrays',
    name: 'Arrays',
    description: 'Guardar e organizar vários valores em uma única estrutura.',
  },
  arrayIndex: {
    id: 'arrayIndex',
    name: 'Índices de arrays',
    description: 'Acessar valores de um array usando posições e índices.',
  },
  arrayLength: {
    id: 'arrayLength',
    name: 'Tamanho de arrays',
    description: 'Usar length para descobrir quantos itens um array possui.',
  },
  arrayMutation: {
    id: 'arrayMutation',
    name: 'Alteração de arrays',
    description: 'Alterar valores de posições existentes em um array.',
  },
  arrayIteration: {
    id: 'arrayIteration',
    name: 'Percorrer arrays',
    description: 'Visitar os itens de um array usando um laço e um índice.',
  },
  arrayPush: {
    id: 'arrayPush',
    name: 'Adicionar itens',
    description: 'Adicionar valores a um array usando push.',
  },
  arraySearch: {
    id: 'arraySearch',
    name: 'Buscar em arrays',
    description: 'Procurar valores dentro de um array e identificar se estão presentes.',
  },
  arrayFilter: {
    id: 'arrayFilter',
    name: 'Filtrar arrays',
    description: 'Selecionar valores de um array e construir uma nova lista.',
  },
  arrayReverse: {
    id: 'arrayReverse',
    name: 'Inverter arrays',
    description: 'Percorrer um array de trás para frente e construir outra lista.',
  },
  arrayDuplicates: {
    id: 'arrayDuplicates',
    name: 'Remover duplicados',
    description: 'Construir uma lista preservando apenas a primeira ocorrência de cada valor.',
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
