import { getConcept } from '../data/concepts';
import { getConceptLearningGuidance } from '../data/conceptGuidance';
import type { Exercise } from '../data/levels';
import type { LastTest, LearningFeedback } from '../types';

export function getLearningFeedback(
  lastTest: LastTest | null,
  currentExercise: Exercise | null,
): LearningFeedback | null {
  if (!lastTest || !currentExercise) return null;

  const conceptId =
    currentExercise.conceptIds?.find((id) => id !== 'return') ||
    currentExercise.conceptIds?.[0];
  const concept = getConcept(conceptId, currentExercise.skill);
  const guidance = getConceptLearningGuidance(conceptId);

  const context = {
    conceptName: concept.name,
    conceptFocus: guidance?.focus,
    reflectionQuestion: guidance?.reflection,
  };

  if (lastTest.passed === lastTest.total) {
    return {
      tone: 'success',
      title: 'Você acertou a lógica.',
      body: 'Os testes confirmaram o comportamento esperado. Antes de seguir, vale identificar o padrão que fez seu código funcionar.',
    };
  }

  const failure = lastTest.firstFailure;

  if (!failure) {
    return {
      tone: 'focus',
      title: 'Você está perto.',
      body: 'Alguns testes ainda não passaram. Comece pelo primeiro ponto que diverge e compare entrada, transformação e resultado.',
      ...context,
    };
  }

  if (failure.error) {
    return {
      tone: 'error',
      ...getExecutionFeedback(failure.error, failure.args),
      ...context,
    };
  }

  return {
    tone: 'focus',
    title: 'A lógica ainda precisa de um ajuste.',
    body: `No primeiro caso que falhou, a entrada foi ${failure.args || '—'}: seu código devolveu ${failure.got || 'undefined'}, mas a missão espera ${failure.expected}.`,
    ...context,
  };
}

function getExecutionFeedback(
  error: string,
  args: string,
): Pick<LearningFeedback, 'title' | 'body'> {
  const errorContext = args ? ` no teste com os valores ${args}` : '';
  const normalized = error.toLowerCase();

  const undefinedMatch = error.match(/([A-Za-z_$][\w$]*) is not defined/);
  if (undefinedMatch) {
    return {
      title: 'Uma variável ainda não está disponível.',
      body: `O JavaScript não encontrou "${undefinedMatch[1]}"${errorContext}. Verifique onde esse valor é criado e em qual trecho do código ele pode ser usado.`,
    };
  }

  if (normalized.includes('função ') && normalized.includes('não encontrada')) {
    return {
      title: 'A função pedida ainda não foi encontrada.',
      body: `Os testes precisam localizar a função esperada antes de verificar a lógica${errorContext}. Confira se o nome da função e sua declaração estão exatamente como a assinatura da missão.`,
    };
  }

  if (normalized.includes('is not a function')) {
    return {
      title: 'Algo foi chamado como função, mas não é uma função.',
      body: `A execução parou${errorContext}. Confira o valor que está recebendo "()": ele precisa realmente representar uma função antes de ser chamado.`,
    };
  }

  if (normalized.includes('cannot read') || normalized.includes('of undefined') || normalized.includes('of null')) {
    return {
      title: 'Um valor não existe no momento em que foi acessado.',
      body: `A execução tentou acessar uma propriedade ou item que não está disponível${errorContext}. Confira a origem desse valor antes de usá-lo.`,
    };
  }

  if (normalized.includes('syntaxerror') || normalized.includes('unexpected token') || normalized.includes('unexpected end')) {
    return {
      title: 'O código não conseguiu ser interpretado.',
      body: `O JavaScript encontrou um problema de sintaxe${errorContext}. Confira chaves, parênteses, aspas e a estrutura das instruções próximas ao ponto indicado.`,
    };
  }

  if (normalized.includes('maximum call stack')) {
    return {
      title: 'A execução entrou em chamadas demais.',
      body: `O código continuou chamando funções sem chegar a uma saída${errorContext}. Confira se existe uma chamada que pode se repetir sem uma condição clara de parada.`,
    };
  }

  return {
    title: 'O problema aconteceu durante a execução.',
    body: `A função não conseguiu concluir o teste${errorContext}. Leia a mensagem abaixo e procure a primeira operação ou valor que pode estar diferente do que você imaginou.`,
  };
}
