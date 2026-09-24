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
  functions: {
    id: 'functions',
    name: 'Funções',
    description: 'Organizar uma tarefa em uma função reutilizável que recebe dados e devolve um resultado.',
  },
  parameters: {
    id: 'parameters',
    name: 'Parâmetros',
    description: 'Receber dados de entrada em uma função por meio de parâmetros.',
  },
  localVariables: {
    id: 'localVariables',
    name: 'Variáveis locais',
    description: 'Usar variáveis dentro de uma função para construir o resultado passo a passo.',
  },
  booleanFunctions: {
    id: 'booleanFunctions',
    name: 'Funções booleanas',
    description: 'Criar funções que respondem perguntas com true ou false.',
  },
  earlyReturn: {
    id: 'earlyReturn',
    name: 'Retorno antecipado',
    description: 'Encerrar uma função assim que uma condição importante for atendida.',
  },
  validation: {
    id: 'validation',
    name: 'Validação',
    description: 'Verificar se uma entrada está dentro das regras antes de processá-la.',
  },
  functionComposition: {
    id: 'functionComposition',
    name: 'Composição de funções',
    description: 'Reutilizar uma função dentro de outra para dividir um problema maior em etapas menores.',
  },
  multiStepLogic: {
    id: 'multiStepLogic',
    name: 'Lógica em etapas',
    description: 'Combinar validação, cálculos, condições e funções auxiliares em uma solução.',
  },
  percentage: {
    id: 'percentage',
    name: 'Porcentagens',
    description: 'Calcular acréscimos, descontos e taxas percentuais.',
  },
  sequentialState: {
    id: 'sequentialState',
    name: 'Estado em sequência',
    description: 'Atualizar mais de um valor ao longo de uma repetição para construir uma sequência de resultados.',
  },

  objects: {
    id: 'objects',
    name: 'Objetos',
    description: 'Organizar informações relacionadas em propriedades de um único valor.',
  },
  objectProperties: {
    id: 'objectProperties',
    name: 'Propriedades de objetos',
    description: 'Representar dados de um objeto usando pares de nome e valor.',
  },
  objectAccess: {
    id: 'objectAccess',
    name: 'Acesso a propriedades',
    description: 'Ler uma propriedade usando a notação de ponto.',
  },
  objectBracketAccess: {
    id: 'objectBracketAccess',
    name: 'Acesso por colchetes',
    description: 'Acessar uma propriedade usando uma variável como nome da propriedade.',
  },
  objectMutation: {
    id: 'objectMutation',
    name: 'Alteração de objetos',
    description: 'Atualizar valores de propriedades existentes em um objeto.',
  },
  objectAddition: {
    id: 'objectAddition',
    name: 'Adicionar propriedades',
    description: 'Criar uma nova propriedade atribuindo um valor ao objeto.',
  },
  objectDeletion: {
    id: 'objectDeletion',
    name: 'Remover propriedades',
    description: 'Excluir uma propriedade de um objeto usando delete.',
  },
  objectValidation: {
    id: 'objectValidation',
    name: 'Validação de objetos',
    description: 'Verificar regras usando os valores armazenados nas propriedades de um objeto.',
  },
  objectCollections: {
    id: 'objectCollections',
    name: 'Arrays de objetos',
    description: 'Trabalhar com listas cujos itens são objetos com as mesmas propriedades.',
  },
  objectIteration: {
    id: 'objectIteration',
    name: 'Percorrer objetos em listas',
    description: 'Percorrer um array de objetos e acessar as propriedades de cada item.',
  },
  objectSearch: {
    id: 'objectSearch',
    name: 'Busca em objetos',
    description: 'Encontrar um objeto em uma lista comparando uma de suas propriedades.',
  },
  objectFunctions: {
    id: 'objectFunctions',
    name: 'Funções com objetos',
    description: 'Usar propriedades de objetos como entradas para cálculos e regras dentro de funções.',
  },
  nullValue: {
    id: 'nullValue',
    name: 'Ausência de valor',
    description: 'Usar null para representar que uma função não encontrou um resultado.',
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
