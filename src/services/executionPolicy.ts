export const MAX_USER_CODE_LENGTH = 20_000;

const BLOCKED_IDENTIFIERS = [
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'Worker',
  'SharedWorker',
  'BroadcastChannel',
  'MessageChannel',
  'importScripts',
  'indexedDB',
  'caches',
  'localStorage',
  'sessionStorage',
  'document',
  'window',
  'self',
  'globalThis',
  'navigator',
  'location',
  'postMessage',
  'close',
  'setTimeout',
  'setInterval',
  'queueMicrotask',
  'Function',
  'eval',
  'WebAssembly',
  'SharedArrayBuffer',
  'Atomics',
] as const;

export const EXECUTION_BLOCKED_GLOBALS = [
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'Worker',
  'SharedWorker',
  'BroadcastChannel',
  'MessageChannel',
  'importScripts',
  'indexedDB',
  'caches',
  'localStorage',
  'sessionStorage',
  'document',
  'window',
  'self',
  'globalThis',
  'navigator',
  'location',
  'postMessage',
  'close',
  'setTimeout',
  'setInterval',
  'queueMicrotask',
  'Function',
  'WebAssembly',
  'SharedArrayBuffer',
  'Atomics',
] as const;

export type ExecutionPolicyResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'code-too-large' | 'blocked-api' | 'dynamic-import';
      error: string;
    };

function maskStringsAndComments(code: string): string {
  let result = '';
  let index = 0;
  let state: 'code' | 'single' | 'double' | 'template' | 'line-comment' | 'block-comment' = 'code';

  while (index < code.length) {
    const char = code[index];
    const next = code[index + 1];

    if (state === 'code') {
      if (char === '/' && next === '/') {
        result += '  ';
        index += 2;
        state = 'line-comment';
        continue;
      }

      if (char === '/' && next === '*') {
        result += '  ';
        index += 2;
        state = 'block-comment';
        continue;
      }

      if (char === "'") {
        result += ' ';
        index += 1;
        state = 'single';
        continue;
      }

      if (char === '"') {
        result += ' ';
        index += 1;
        state = 'double';
        continue;
      }

      if (char === '`') {
        result += ' ';
        index += 1;
        state = 'template';
        continue;
      }

      result += char;
      index += 1;
      continue;
    }

    if (state === 'line-comment') {
      if (char === '\n') {
        result += '\n';
        state = 'code';
      } else {
        result += ' ';
      }

      index += 1;
      continue;
    }

    if (state === 'block-comment') {
      if (char === '*' && next === '/') {
        result += '  ';
        index += 2;
        state = 'code';
        continue;
      }

      result += char === '\n' ? '\n' : ' ';
      index += 1;
      continue;
    }

    if (char === '\\') {
      result += ' ';
      if (index + 1 < code.length) result += ' ';
      index += 2;
      continue;
    }

    const closingQuote =
      (state === 'single' && char === "'")
      || (state === 'double' && char === '"')
      || (state === 'template' && char === '`');

    result += char === '\n' ? '\n' : ' ';
    index += 1;

    if (closingQuote) {
      state = 'code';
    }
  }

  return result;
}

export function validateExecutionPolicy(code: string): ExecutionPolicyResult {
  if (code.length > MAX_USER_CODE_LENGTH) {
    return {
      ok: false,
      reason: 'code-too-large',
      error: `Seu código ultrapassou o limite de ${MAX_USER_CODE_LENGTH.toLocaleString('pt-BR')} caracteres deste ambiente de prática.`,
    };
  }

  const maskedCode = maskStringsAndComments(code);

  if (/\bimport\s*\(/.test(maskedCode)) {
    return {
      ok: false,
      reason: 'dynamic-import',
      error: 'Importações dinâmicas não fazem parte do ambiente de exercícios do CodeMpi.',
    };
  }

  for (const identifier of BLOCKED_IDENTIFIERS) {
    const pattern = new RegExp(`\\b${identifier}\\b`);

    if (pattern.test(maskedCode)) {
      return {
        ok: false,
        reason: 'blocked-api',
        error: `${identifier} não está disponível no ambiente de exercícios do CodeMpi.`,
      };
    }
  }

  return { ok: true };
}
