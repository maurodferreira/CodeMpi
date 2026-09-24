import type { ExerciseTest } from '../data/contentTypes';
import {
  executeFunctionSync,
  executeTestsSync,
} from './codeExecutionCore';

export interface TestCaseExecution {
  index: number;
  args: unknown[];
  expected: unknown;
  result?: unknown;
  error?: string;
  passed: boolean;
}

export type TestExecutionResult =
  | {
      status: 'compile-error' | 'missing-function' | 'timeout' | 'execution-error';
      error: string;
      passed: 0;
      total: number;
      cases: [];
    }
  | {
      status: 'completed';
      passed: number;
      total: number;
      cases: TestCaseExecution[];
    };

export type FunctionExecutionResult =
  | {
      status: 'success';
      value: unknown;
    }
  | {
      status:
        | 'compile-error'
        | 'missing-function'
        | 'runtime-error'
        | 'timeout'
        | 'execution-error';
      error: string;
    };

export interface CodeExecutor {
  runTests(
    code: string,
    functionName: string,
    tests: ExerciseTest[],
  ): Promise<TestExecutionResult>;

  runFunction(
    code: string,
    functionName: string,
    args: unknown[],
  ): Promise<FunctionExecutionResult>;
}

export const browserCodeExecutor: CodeExecutor = {
  async runTests(code, functionName, tests) {
    return executeTestsSync(code, functionName, tests);
  },

  async runFunction(code, functionName, args) {
    return executeFunctionSync(code, functionName, args);
  },
};
