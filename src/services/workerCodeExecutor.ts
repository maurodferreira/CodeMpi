import type {
  CodeExecutor,
  FunctionExecutionResult,
  TestExecutionResult,
} from './codeExecutor';
import type {
  CodeExecutorWorkerRequest,
  CodeExecutorWorkerResponse,
} from './codeExecutorProtocol';

export const DEFAULT_EXECUTION_TIMEOUT_MS = 1500;

interface WorkerExecutorOptions {
  timeoutMs?: number;
  workerFactory?: () => Worker;
}

function createBrowserWorker(): Worker {
  return new Worker(
    new URL('../workers/codeExecutor.worker.ts', import.meta.url),
    { type: 'module' },
  );
}

function getWorkerErrorMessage(event: ErrorEvent): string {
  return event.message || 'O ambiente de execução encontrou um erro inesperado.';
}

export function createWorkerCodeExecutor(
  options: WorkerExecutorOptions = {},
): CodeExecutor {
  const timeoutMs = options.timeoutMs ?? DEFAULT_EXECUTION_TIMEOUT_MS;
  const workerFactory = options.workerFactory ?? createBrowserWorker;

  function runRequest(
    request: CodeExecutorWorkerRequest,
  ): Promise<CodeExecutorWorkerResponse> {
    return new Promise((resolve) => {
      const worker = workerFactory();
      let settled = false;

      const finish = (response: CodeExecutorWorkerResponse) => {
        if (settled) return;

        settled = true;
        clearTimeout(timeoutId);
        worker.terminate();
        resolve(response);
      };

      const timeoutId = setTimeout(() => {
        if (request.kind === 'tests') {
          finish({
            kind: 'tests',
            result: {
              status: 'timeout',
              error: 'A execução demorou demais e foi interrompida. Verifique se algum loop pode estar rodando sem terminar.',
              passed: 0,
              total: request.tests.length,
              cases: [],
            },
          });
          return;
        }

        finish({
          kind: 'function',
          result: {
            status: 'timeout',
            error: 'A execução demorou demais e foi interrompida. Verifique se algum loop pode estar rodando sem terminar.',
          },
        });
      }, timeoutMs);

      worker.onmessage = (event: MessageEvent<CodeExecutorWorkerResponse>) => {
        finish(event.data);
      };

      worker.onerror = (event: ErrorEvent) => {
        const error = getWorkerErrorMessage(event);

        if (request.kind === 'tests') {
          finish({
            kind: 'tests',
            result: {
              status: 'execution-error',
              error,
              passed: 0,
              total: request.tests.length,
              cases: [],
            },
          });
          return;
        }

        finish({
          kind: 'function',
          result: {
            status: 'execution-error',
            error,
          },
        });
      };

      worker.postMessage(request);
    });
  }

  return {
    async runTests(code, functionName, tests): Promise<TestExecutionResult> {
      const response = await runRequest({
        kind: 'tests',
        code,
        functionName,
        tests,
      });

      if (response.kind !== 'tests') {
        return {
          status: 'execution-error',
          error: 'O executor respondeu com um formato inesperado.',
          passed: 0,
          total: tests.length,
          cases: [],
        };
      }

      return response.result;
    },

    async runFunction(code, functionName, args): Promise<FunctionExecutionResult> {
      const response = await runRequest({
        kind: 'function',
        code,
        functionName,
        args,
      });

      if (response.kind !== 'function') {
        return {
          status: 'execution-error',
          error: 'O executor respondeu com um formato inesperado.',
        };
      }

      return response.result;
    },
  };
}

export const workerCodeExecutor = createWorkerCodeExecutor();
