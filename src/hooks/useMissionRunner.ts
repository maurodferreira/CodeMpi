import { useState, type Dispatch, type SetStateAction } from 'react';
import type { Exercise } from '../data/levels';
import { getConcept, getConceptLearningGuidance } from '../data/concepts';
import type { ConsoleLog, LastTest, LearningFeedback, StoreData } from '../types';
import { calculateExerciseXp } from '../utils/xp';

interface UseMissionRunnerParams {
  currentExercise: Exercise | null;
  levelIndex: number;
  exerciseIndex: number;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  hintsShown: number;
  store: StoreData;
  setStore: Dispatch<SetStateAction<StoreData>>;
  registerActivity: () => void;
  getKey: (li: number, ei: number) => string;
}

interface FreeResult {
  ok: boolean;
  value?: string;
  error?: string;
}

export function useMissionRunner({
  currentExercise,
  levelIndex,
  exerciseIndex,
  code,
  setCode,
  hintsShown,
  store,
  setStore,
  registerActivity,
  getKey,
}: UseMissionRunnerParams) {
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [isPassed, setIsPassed] = useState(false);
  const [lastTest, setLastTest] = useState<LastTest | null>(null);
  const [freeInputs, setFreeInputs] = useState<string[]>([]);
  const [freeResult, setFreeResult] = useState<FreeResult | null>(null);
  const [showFreeTest, setShowFreeTest] = useState(false);

  const resetMissionState = (exercise: Exercise | null) => {
    setCode(exercise?.starter || '');
    setConsoleLogs([]);
    setIsPassed(false);
    setLastTest(null);
    setFreeInputs(exercise?.tests[0]?.args.map(formatInput) || []);
    setFreeResult(null);
    setShowFreeTest(false);
  };

  const handleResetCode = () => {
    if (!currentExercise) return;

    resetMissionState(currentExercise);
  };

  const handleFreeTest = () => {
    if (!currentExercise) return;

    let userFn: unknown;

    try {
      const wrapper = new Function(
        code + `\nreturn typeof ${currentExercise.fn} === "function" ? ${currentExercise.fn} : undefined;`,
      );

      userFn = wrapper({
        log: () => {},
        warn: () => {},
        error: () => {},
      });
    } catch (error: unknown) {
      setFreeResult({
        ok: false,
        error: getErrorMessage(error, 'Erro de sintaxe no código.'),
      });
      return;
    }

    if (typeof userFn !== 'function') {
      setFreeResult({
        ok: false,
        error: `Função ${currentExercise.fn} não encontrada.`,
      });
      return;
    }

    try {
      const args = freeInputs.map(parseInput);
      const result = userFn(...args);
      setFreeResult({
        ok: true,
        value: JSON.stringify(result) ?? String(result),
      });
    } catch (error: unknown) {
      setFreeResult({
        ok: false,
        error: getErrorMessage(error, 'Erro durante a execução.'),
      });
    }
  };

  const handleEvaluate = () => {
    if (!currentExercise) return;

    const key = getKey(levelIndex, exerciseIndex);
    registerActivity();

    setStore((prev) => ({
      ...prev,
      performance: {
        ...prev.performance,
        [key]: {
          attempts: (prev.performance[key]?.attempts || 0) + 1,
          failures: prev.performance[key]?.failures || 0,
        },
      },
    }));

    const logs: ConsoleLog[] = [];
    let userFn: unknown;

    try {
      const wrapper = new Function(
        'console',
        code + `\nreturn typeof ${currentExercise.fn} === "function" ? ${currentExercise.fn} : undefined;`,
      );

      userFn = wrapper({
        log: () => {},
        warn: () => {},
        error: () => {},
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Erro de sintaxe');

      setConsoleLogs([{
        tag: 'sintaxe',
        msg: 'O JavaScript encontrou um problema antes de conseguir executar sua função.',
        ok: false,
      }]);

      setLastTest({
        passed: 0,
        total: currentExercise.tests.length,
        firstFailure: { args: '', got: '', expected: '', error: message },
      });
      setStore((prev) => ({
        ...prev,
        performance: {
          ...prev.performance,
          [key]: {
            attempts: prev.performance[key]?.attempts || 1,
            failures: (prev.performance[key]?.failures || 0) + 1,
          },
        },
      }));
      setIsPassed(false);
      return;
    }

    if (typeof userFn !== 'function') {
      setStore((prev) => ({
        ...prev,
        performance: {
          ...prev.performance,
          [key]: {
            attempts: prev.performance[key]?.attempts || 1,
            failures: (prev.performance[key]?.failures || 0) + 1,
          },
        },
      }));

      const expectedFn = currentExercise.fn;

      setConsoleLogs([{
        tag: 'estrutura',
        msg: `Ainda não encontrei uma função chamada ${expectedFn}. Confira o nome e a estrutura pedidos na missão.`,
        ok: false,
      }]);

      setLastTest({
        passed: 0,
        total: currentExercise.tests.length,
        firstFailure: {
          args: '',
          got: '',
          expected: '',
          error: `Função ${expectedFn} não encontrada.`,
        },
      });
      setIsPassed(false);
      return;
    }

    let passed = 0;
    let firstFailure: LastTest['firstFailure'];

    currentExercise.tests.forEach((test, index) => {
      let result: unknown;
      let error: string | null = null;

      try {
        result = userFn(...test.args);
      } catch (caught: unknown) {
        error = getErrorMessage(caught, 'Erro durante a execução');
      }

      const argsStr = test.args.map(formatInput).join(', ');
      const expectedStr = JSON.stringify(test.exp);

      if (error) {
        logs.push({
          tag: `teste ${index + 1}`,
          msg: `${currentExercise.fn}(${argsStr}) encontrou um erro durante a execução.`,
          ok: false,
        });

        if (!firstFailure) {
          firstFailure = {
            args: argsStr,
            got: '',
            expected: expectedStr,
            error,
          };
        }
        return;
      }

      const gotStr = JSON.stringify(result);
      const pass = gotStr === expectedStr;

      if (pass) {
        passed += 1;
      } else if (!firstFailure) {
        firstFailure = {
          args: argsStr,
          got: gotStr ?? 'undefined',
          expected: expectedStr,
        };
      }

      logs.push({
        tag: `teste ${index + 1}`,
        msg: pass
          ? `${currentExercise.fn}(${argsStr}) → resultado correto: ${gotStr}`
          : `${currentExercise.fn}(${argsStr}) → seu resultado: ${gotStr}; esperado: ${expectedStr}`,
        ok: pass,
      });
    });

    setLastTest({
      passed,
      total: currentExercise.tests.length,
      firstFailure,
    });

    if (passed === currentExercise.tests.length) {
      const earnedXp = calculateExerciseXp(currentExercise.xp, hintsShown);

      logs.push({
        tag: 'info',
        msg: `${passed} de ${currentExercise.tests.length} testes passaram. Você dominou este desafio.`,
      });

      if (!store.done[key]) {
        setStore((prev) => ({
          ...prev,
          done: {
            ...prev.done,
            [key]: earnedXp,
          },
        }));
      }

      setIsPassed(true);
    } else {
      setStore((prev) => ({
        ...prev,
        performance: {
          ...prev.performance,
          [key]: {
            attempts: prev.performance[key]?.attempts || 1,
            failures: (prev.performance[key]?.failures || 0) + 1,
          },
        },
      }));
      setIsPassed(false);
    }

    setConsoleLogs(logs);
  };

  const learningFeedback = getLearningFeedback(lastTest, currentExercise);

  return {
    consoleLogs,
    isPassed,
    lastTest,
    freeInputs,
    setFreeInputs,
    freeResult,
    setFreeResult,
    showFreeTest,
    setShowFreeTest,
    learningFeedback,
    resetMissionState,
    handleEvaluate,
    handleResetCode,
    handleFreeTest,
  };
}

function formatInput(value: unknown): string {
  const json = JSON.stringify(value);
  return json ?? String(value);
}

function parseInput(raw: string): unknown {
  const trimmed = raw.trim();

  if (!trimmed) return undefined;

  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function getLearningFeedback(lastTest: LastTest | null, currentExercise: Exercise | null): LearningFeedback | null {
  if (!lastTest || !currentExercise) return null;

  const conceptId = currentExercise.conceptIds?.find((id) => id !== 'return') || currentExercise.conceptIds?.[0];
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

function getExecutionFeedback(error: string, args: string): Pick<LearningFeedback, 'title' | 'body'> {
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
