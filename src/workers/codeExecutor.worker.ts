import {
  executeFunctionSync,
  executeTestsSync,
} from '../services/codeExecutionCore';
import type {
  CodeExecutorWorkerRequest,
  CodeExecutorWorkerResponse,
} from '../services/codeExecutorProtocol';

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<CodeExecutorWorkerRequest>) => void) | null;
  postMessage: (message: CodeExecutorWorkerResponse) => void;
};

workerScope.onmessage = (event) => {
  const request = event.data;

  if (request.kind === 'tests') {
    workerScope.postMessage({
      kind: 'tests',
      result: executeTestsSync(
        request.code,
        request.functionName,
        request.tests,
      ),
    });
    return;
  }

  workerScope.postMessage({
    kind: 'function',
    result: executeFunctionSync(
      request.code,
      request.functionName,
      request.args,
    ),
  });
};

export {};
