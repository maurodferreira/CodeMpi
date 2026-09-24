import type { ExerciseTest } from '../data/contentTypes';
import { areValuesEqual } from '../utils/valueEquality';
import type {
  FunctionExecutionResult,
  TestCaseExecution,
  TestExecutionResult,
} from './codeExecutor';

type UserFunction = (...args: unknown[]) => unknown;

interface CompileSuccess {
  status: 'success';
  fn: UserFunction;
}

interface CompileFailure {
  status: 'compile-error' | 'missing-function';
  error: string;
}

type CompileResult = CompileSuccess | CompileFailure;

const silentConsole = {
  log: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function compileFunction(
  code: string,
  functionName: string,
  silenceConsole: boolean,
): CompileResult {
  try {
    const source = `${code}\nreturn typeof ${functionName} === "function" ? ${functionName} : undefined;`;
    const wrapper = silenceConsole
      ? new Function('console', source)
      : new Function(source);
    const value = silenceConsole ? wrapper(silentConsole) : wrapper();

    if (typeof value !== 'function') {
      return {
        status: 'missing-function',
        error: `Função ${functionName} não encontrada.`,
      };
    }

    return {
      status: 'success',
      fn: value as UserFunction,
    };
  } catch (error: unknown) {
    return {
      status: 'compile-error',
      error: getErrorMessage(error, 'Erro de sintaxe no código.'),
    };
  }
}

export function executeTestsSync(
  code: string,
  functionName: string,
  tests: ExerciseTest[],
): TestExecutionResult {
  const compiled = compileFunction(code, functionName, true);

  if (compiled.status !== 'success') {
    return {
      status: compiled.status,
      error: compiled.error,
      passed: 0,
      total: tests.length,
      cases: [],
    };
  }

  let passed = 0;

  const cases = tests.map<TestCaseExecution>((test, index) => {
    try {
      const args = structuredClone(test.args);
      const result = compiled.fn(...args);
      const isCorrect = areValuesEqual(result, test.exp);

      if (isCorrect) passed += 1;

      return {
        index,
        args: test.args,
        expected: test.exp,
        result,
        passed: isCorrect,
      };
    } catch (error: unknown) {
      return {
        index,
        args: test.args,
        expected: test.exp,
        error: getErrorMessage(error, 'Erro durante a execução'),
        passed: false,
      };
    }
  });

  return {
    status: 'completed',
    passed,
    total: tests.length,
    cases,
  };
}

export function executeFunctionSync(
  code: string,
  functionName: string,
  args: unknown[],
): FunctionExecutionResult {
  const compiled = compileFunction(code, functionName, false);

  if (compiled.status !== 'success') {
    return compiled;
  }

  try {
    return {
      status: 'success',
      value: compiled.fn(...structuredClone(args)),
    };
  } catch (error: unknown) {
    return {
      status: 'runtime-error',
      error: getErrorMessage(error, 'Erro durante a execução.'),
    };
  }
}
