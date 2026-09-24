import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { Exercise } from '../data/levels';
import {
  browserCodeExecutor,
  type CodeExecutor,
  type TestExecutionResult,
} from '../services/codeExecutor';
import { workerCodeExecutor } from '../services/workerCodeExecutor';
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

const defaultCodeExecutor: CodeExecutor =
  typeof Worker === 'undefined' ? browserCodeExecutor : workerCodeExecutor;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
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
  executor = defaultCodeExecutor,
}: UseMissionRunnerParams) {
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [isPassed, setIsPassed] = useState(false);
  const [lastTest, setLastTest] = useState<LastTest | null>(null);
  const [freeInputs, setFreeInputs] = useState<string[]>([]);
  const [freeResult, setFreeResult] = useState<FreeResult | null>(null);
  const [showFreeTest, setShowFreeTest] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const runIdRef = useRef(0);

  const resetMissionState = (exercise: Exercise | null) => {
    runIdRef.current += 1;
    setIsRunning(false);
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

  const handleFreeTest = async () => {
    if (!currentExercise || isRunning) return;

    const runId = ++runIdRef.current;
    setIsRunning(true);

    try {
      const args = freeInputs.map(parseInput);
      const execution = await executor.runFunction(
        code,
        currentExercise.fn,
        args,
      );

      if (runId !== runIdRef.current) return;

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
    } catch (error: unknown) {
      if (runId !== runIdRef.current) return;

      setFreeResult({
        ok: false,
        error: getErrorMessage(
          error,
          'Não foi possível executar este teste agora.',
        ),
      });
    } finally {
      if (runId === runIdRef.current) {
        setIsRunning(false);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!currentExercise || isRunning) return;

    const runId = ++runIdRef.current;
    const key = getKey(levelIndex, exerciseIndex);

    setIsRunning(true);
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

    let execution: TestExecutionResult;

    try {
      execution = await executor.runTests(
        code,
        currentExercise.fn,
        currentExercise.tests,
      );
    } catch (error: unknown) {
      execution = {
        status: 'execution-error',
        error: getErrorMessage(
          error,
          'O ambiente de execução encontrou um erro inesperado.',
        ),
        passed: 0,
        total: currentExercise.tests.length,
        cases: [],
      };
    }

    if (runId !== runIdRef.current) return;

    try {
      if (execution.status !== 'completed') {
        const expectedFn = currentExercise.fn;

        const failurePresentation = execution.status === 'compile-error'
          ? {
              tag: 'sintaxe',
              message: 'O JavaScript encontrou um problema antes de conseguir executar sua função.',
            }
          : execution.status === 'missing-function'
            ? {
                tag: 'estrutura',
                message: `Ainda não encontrei uma função chamada ${expectedFn}. Confira o nome e a estrutura pedidos na missão.`,
              }
            : execution.status === 'policy-error'
              ? {
                  tag: 'ambiente',
                  message: execution.error,
                }
            : execution.status === 'timeout'
              ? {
                  tag: 'tempo',
                  message: 'A execução demorou demais e foi interrompida. Verifique se algum loop pode estar rodando sem terminar.',
                }
              : {
                  tag: 'execução',
                  message: 'Não foi possível concluir a execução. Tente novamente antes de continuar.',
                };

        setConsoleLogs([{
          tag: failurePresentation.tag,
          msg: failurePresentation.message,
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
    } finally {
      if (runId === runIdRef.current) {
        setIsRunning(false);
      }
    }
  };

  const learningFeedback = getLearningFeedback(lastTest, currentExercise);

  return {
    consoleLogs,
    isPassed,
    isRunning,
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
