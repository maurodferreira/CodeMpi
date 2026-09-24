import { useState, type Dispatch, type SetStateAction } from 'react';
import type { Exercise } from '../data/levels';
import type { ConsoleLog, LastTest, StoreData } from '../types';
import { calculateExerciseXp } from '../utils/xp';
import { getLearningFeedback } from '../utils/learningFeedback';

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
        const testArgs = structuredClone(test.args);
        result = userFn(...testArgs);
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
      const pass = areValuesEqual(result, test.exp);

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

function areValuesEqual(actual: unknown, expected: unknown): boolean {
  if (actual === expected) return true;

  if (Array.isArray(actual) && Array.isArray(expected)) {
    return actual.length === expected.length &&
      actual.every((value, index) => areValuesEqual(value, expected[index]));
  }

  if (
    actual !== null &&
    expected !== null &&
    typeof actual === 'object' &&
    typeof expected === 'object' &&
    !Array.isArray(actual) &&
    !Array.isArray(expected)
  ) {
    const actualRecord = actual as Record<string, unknown>;
    const expectedRecord = expected as Record<string, unknown>;
    const actualKeys = Object.keys(actualRecord).sort();
    const expectedKeys = Object.keys(expectedRecord).sort();

    return actualKeys.length === expectedKeys.length &&
      actualKeys.every((key, index) => (
        key === expectedKeys[index] &&
        areValuesEqual(actualRecord[key], expectedRecord[key])
      ));
  }

  return Number.isNaN(actual) && Number.isNaN(expected);
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

