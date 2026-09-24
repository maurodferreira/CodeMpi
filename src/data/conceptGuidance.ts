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
  variables: {
    focus: 'Acompanhe o valor guardado na variável e observe cada atribuição que pode atualizá-lo antes do return.',
    reflection: 'Qual valor essa variável possui exatamente no momento em que a função devolve o resultado?',
  },
  strings: {
    focus: 'Trate o texto como uma sequência de caracteres e identifique se a missão pede leitura, transformação ou comparação.',
    reflection: 'Você precisa usar o texto inteiro ou trabalhar com caracteres específicos dele?',
  },
  stringLength: {
    focus: 'length informa quantos caracteres existem no texto; ele não representa o último índice diretamente.',
    reflection: 'Se o texto tem N caracteres, qual é o valor de length e qual é o último índice válido?',
  },
  stringIndex: {
    focus: 'Lembre que os índices começam em zero e confira se a posição pedida existe antes de acessar o caractere.',
    reflection: 'Qual índice corresponde à posição descrita no enunciado?',
  },
  stringCase: {
    focus: 'Confira se a missão pede transformar todo o texto e se a função escolhida corresponde a maiúsculas ou minúsculas.',
    reflection: 'O resultado precisa estar todo em maiúsculas ou todo em minúsculas?',
  },
  stringIteration: {
    focus: 'Percorra o texto do índice zero até antes de length e observe qual caractere é processado em cada volta.',
    reflection: 'Seu laço visita todos os caracteres exatamente uma vez?',
  },
  stringReplacement: {
    focus: 'Identifique qual trecho deve ser substituído, por qual valor e se a troca precisa acontecer em todas as ocorrências.',
    reflection: 'A missão pede substituir uma ocorrência ou todas as ocorrências encontradas?',
  },
  stringComparison: {
    focus: 'Compare os textos exatamente como a missão pede, prestando atenção a maiúsculas, minúsculas e caracteres.',
    reflection: 'Os dois textos precisam ser exatamente iguais ou existe alguma transformação antes da comparação?',
  },
  palindrome: {
    focus: 'Compare o texto original com a ordem inversa ou confronte posições equivalentes das duas extremidades.',
    reflection: 'O primeiro caractere corresponde ao último, o segundo ao penúltimo e assim por diante?',
  },
  arrays: {
    focus: 'Veja o array como uma coleção ordenada de valores e descubra se a missão pede acessar, percorrer ou construir uma lista.',
    reflection: 'Você precisa de um item específico ou precisa analisar vários itens do array?',
  },
  arrayIndex: {
    focus: 'Os índices começam em zero; relacione a posição desejada com o índice correto antes de acessar o array.',
    reflection: 'Qual índice representa o item que o enunciado está pedindo?',
  },
  arrayLength: {
    focus: 'Use length para saber quantos itens existem e lembre que o último índice é length - 1.',
    reflection: 'Você quer a quantidade de itens ou a posição do último item?',
  },
  arrayMutation: {
    focus: 'Identifique qual posição já existe no array e atribua o novo valor somente naquele índice.',
    reflection: 'Qual índice deve mudar e quais itens precisam permanecer iguais?',
  },
  arrayIteration: {
    focus: 'Percorra os índices válidos do array e use valores[i] para trabalhar com o item atual.',
    reflection: 'Seu laço começa em zero e termina antes de valores.length?',
  },
  arrayPush: {
    focus: 'Quando a solução constrói uma nova lista, adicione cada item somente no momento em que ele atender à regra.',
    reflection: 'Em qual condição o item atual deve ser colocado no array de resultado?',
  },
  arraySearch: {
    focus: 'Percorra a lista procurando uma correspondência e encerre a busca quando encontrar o valor desejado.',
    reflection: 'O que deve acontecer quando o valor for encontrado e o que deve acontecer se o laço terminar sem encontrá-lo?',
  },
  arrayFilter: {
    focus: 'Separe a regra de seleção da construção do resultado: primeiro decida se o item passa, depois adicione-o à nova lista.',
    reflection: 'Qual condição define exatamente quais itens entram no resultado?',
  },
  arrayReverse: {
    focus: 'Percorra os índices do fim para o começo e construa uma nova lista na ordem visitada.',
    reflection: 'Qual é o primeiro índice que deve ser visitado quando você percorre o array ao contrário?',
  },
  arrayDuplicates: {
    focus: 'Antes de adicionar um valor ao resultado, verifique se ele já apareceu na lista construída.',
    reflection: 'Como impedir que a segunda ocorrência de um mesmo valor seja adicionada novamente?',
  },
  functions: {
    focus: 'Leia a função como uma tarefa com entradas, processamento e saída. Mantenha cada responsabilidade clara.',
    reflection: 'Qual é a única tarefa principal que esta função precisa cumprir?',
  },
  parameters: {
    focus: 'Relacione cada parâmetro da assinatura com o dado que chega na chamada e use esses nomes dentro da função.',
    reflection: 'Qual valor cada parâmetro representa quando a função é chamada?',
  },
  localVariables: {
    focus: 'Use variáveis locais para guardar resultados intermediários e acompanhe como cada uma evolui até o return.',
    reflection: 'Qual valor intermediário vale a pena nomear para deixar a solução mais clara?',
  },
  booleanFunctions: {
    focus: 'Transforme a regra do enunciado em uma pergunta que possa ser respondida diretamente com true ou false.',
    reflection: 'Qual condição precisa ser verdadeira para a função devolver true?',
  },
  earlyReturn: {
    focus: 'Coloque os casos que encerram a função logo que forem conhecidos, evitando executar etapas desnecessárias depois.',
    reflection: 'Existe algum caso em que você já sabe a resposta antes de chegar ao final da função?',
  },
  validation: {
    focus: 'Confira primeiro se os dados respeitam os limites e regras definidos; só depois execute o processamento principal.',
    reflection: 'Quais entradas devem ser rejeitadas antes de qualquer cálculo?',
  },
  functionComposition: {
    focus: 'Divida o problema em funções menores e use o retorno de uma delas como parte da solução da função principal.',
    reflection: 'Qual etapa pode virar uma função auxiliar reutilizável?',
  },
  multiStepLogic: {
    focus: 'Resolva o problema em ordem: valide, calcule, aplique regras e só então monte ou devolva o resultado.',
    reflection: 'Qual é a sequência mínima de etapas para chegar ao resultado sem misturar responsabilidades?',
  },
  percentage: {
    focus: 'Converta a porcentagem para uma fração dividindo por 100 e confira se ela representa acréscimo, desconto ou taxa.',
    reflection: 'Você precisa calcular apenas o valor percentual ou aplicar esse valor ao total original?',
  },
  sequentialState: {
    focus: 'Quando dois ou mais valores mudam a cada repetição, acompanhe o estado antigo antes de atualizar o próximo estado.',
    reflection: 'Quais valores da volta atual são necessários para calcular a próxima volta?',
  },
  objects: {
    focus: 'Veja o objeto como um conjunto de informações relacionadas e identifique quais propriedades realmente importam para a missão.',
    reflection: 'Quais dados pertencem ao objeto e quais propriedades você precisa usar?',
  },
  objectProperties: {
    focus: 'Relacione cada nome de propriedade ao valor que ele representa dentro do objeto.',
    reflection: 'Qual propriedade guarda exatamente a informação pedida pelo exercício?',
  },
  objectAccess: {
    focus: 'Use a notação de ponto quando o nome da propriedade é conhecido diretamente no código.',
    reflection: 'Qual propriedade fixa você precisa ler deste objeto?',
  },
  objectBracketAccess: {
    focus: 'Use colchetes quando o nome da propriedade está dentro de uma variável, em vez de escrever esse nome diretamente.',
    reflection: 'O nome da propriedade é fixo ou chega dinamicamente por uma variável?',
  },
  objectMutation: {
    focus: 'Atualize somente a propriedade necessária e confirme que as demais informações do objeto permanecem intactas.',
    reflection: 'Qual propriedade muda e qual novo valor ela deve receber?',
  },
  objectAddition: {
    focus: 'Uma atribuição para uma propriedade inexistente cria essa propriedade no objeto.',
    reflection: 'Qual nova informação precisa passar a fazer parte do objeto?',
  },
  objectDeletion: {
    focus: 'Use delete apenas na propriedade que deve deixar de existir e devolva o objeto com os outros dados preservados.',
    reflection: 'Qual propriedade precisa desaparecer completamente do objeto?',
  },
  objectValidation: {
    focus: 'Leia as propriedades relevantes e transforme cada regra do objeto em uma condição clara antes de combiná-las.',
    reflection: 'Quais propriedades precisam obedecer às regras para o objeto ser considerado válido?',
  },
  objectCollections: {
    focus: 'Em um array de objetos, primeiro encontre o item pelo índice e depois acesse a propriedade necessária desse objeto.',
    reflection: 'Em cada volta do laço, qual objeto está sendo analisado e qual propriedade dele interessa?',
  },
  objectIteration: {
    focus: 'Percorra a lista normalmente e use lista[i].propriedade para trabalhar com o dado do objeto atual.',
    reflection: 'Seu laço visita cada objeto e lê a propriedade certa em cada item?',
  },
  objectSearch: {
    focus: 'Compare uma propriedade identificadora de cada objeto e retorne o objeto assim que encontrar a correspondência.',
    reflection: 'Qual propriedade identifica o objeto procurado e o que deve ser devolvido se ele não existir?',
  },
  objectFunctions: {
    focus: 'Receba o objeto como uma entrada organizada e use suas propriedades para executar cálculos ou regras dentro da função.',
    reflection: 'Quais propriedades fornecem os dados necessários para o resultado desta função?',
  },
  nullValue: {
    focus: 'Use null quando a ausência de um resultado for uma resposta válida e esperada pela função.',
    reflection: 'Em qual situação a função termina sem encontrar um valor para devolver?',
  },

};

export function getConceptLearningGuidance(conceptId?: string): ConceptLearningGuidance | null {
  return conceptId ? CONCEPT_LEARNING_GUIDANCE[conceptId] || null : null;
}
