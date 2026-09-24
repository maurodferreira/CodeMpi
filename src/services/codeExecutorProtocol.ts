import type { ExerciseTest } from '../data/contentTypes';
import type {
  FunctionExecutionResult,
  TestExecutionResult,
} from './codeExecutor';

export type CodeExecutorWorkerRequest =
  | {
      kind: 'tests';
      code: string;
      functionName: string;
      tests: ExerciseTest[];
    }
  | {
      kind: 'function';
      code: string;
      functionName: string;
      args: unknown[];
    };

export type CodeExecutorWorkerResponse =
  | {
      kind: 'tests';
      result: TestExecutionResult;
    }
  | {
      kind: 'function';
      result: FunctionExecutionResult;
    };
