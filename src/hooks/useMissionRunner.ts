import { useState, type Dispatch, type SetStateAction } from 'react';
import type { Exercise } from '../data/levels';
import { browserCodeExecutor, type CodeExecutor } from '../services/codeExecutor';
import type { ConsoleLog, LastTest, StoreData } from '../types';
import { getLearningFeedback } from '../utils/learningFeedback';
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
  executor?: CodeExecutor;
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
  executor = browserCodeExecutor,
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

    const args = freeInputs.map(parseInput);
    const execution = executor.runFunction(
      code,
      currentExercise.fn,
      args,
    );

    if (execution.status === 'success') {
      setFreeResult({
        ok: true,
        value: formatInput(execution.value),
      });
      return;
    }

    setFreeResult({
      ok: false,
      error: execution.error,
    });
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

    const execution = executor.runTests(
      code,
      currentExercise.fn,
      currentExercise.tests,
    );

    if (execution.status === 'compile-error') {
      setConsoleLogs([{
        tag: 'sintaxe',
        msg: 'O JavaScript encontrou um problema antes de conseguir executar sua função.',
        ok: false,
      }]);

      setLastTest({
        passed: 0,
        total: currentExercise.tests.length,
        firstFailure: {
          args: '',
          got: '',
          expected: '',
          error: execution.error,
        },
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

    if (execution.status === 'missing-function') {
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
          error: execution.error,
        },
      });

      setIsPassed(false);
      return;
    }

    const logs: ConsoleLog[] = [];
    let firstFailure: LastTest['firstFailure'];

    execution.cases.forEach((testCase) => {
      const argsStr = testCase.args.map(formatInput).join(', ');
      const expectedStr = formatInput(testCase.expected);

      if (testCase.error) {
        logs.push({
          tag: `teste ${testCase.index + 1}`,
          msg: `${currentExercise.fn}(${argsStr}) encontrou um erro durante a execução.`,
          ok: false,
        });

        if (!firstFailure) {
          firstFailure = {
            args: argsStr,
            got: '',
            expected: expectedStr,
            error: testCase.error,
          };
        }

        return;
      }

      const gotStr = formatInput(testCase.result);

      if (!testCase.passed && !firstFailure) {
        firstFailure = {
          args: argsStr,
          got: gotStr,
          expected: expectedStr,
        };
      }

      logs.push({
        tag: `teste ${testCase.index + 1}`,
        msg: testCase.passed
          ? `${currentExercise.fn}(${argsStr}) → resultado correto: ${gotStr}`
          : `${currentExercise.fn}(${argsStr}) → seu resultado: ${gotStr}; esperado: ${expectedStr}`,
        ok: testCase.passed,
      });
    });

    setLastTest({
      passed: execution.passed,
      total: execution.total,
      firstFailure,
    });

    if (execution.passed === execution.total) {
      const earnedXp = calculateExerciseXp(currentExercise.xp, hintsShown);

      logs.push({
        tag: 'info',
        msg: `${execution.passed} de ${execution.total} testes passaram. Você dominou este desafio.`,
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
