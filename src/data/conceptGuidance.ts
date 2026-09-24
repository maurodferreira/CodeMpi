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
