import { randomUUID } from 'node:crypto';
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from 'node:http';
import type { ApiConfig } from './config.js';
import {
  routeApiRequest,
  type ApiRouteResponse,
  type DatabaseHealthStatus,
} from './router.js';

interface BodyReadSuccess {
  ok: true;
  body: unknown;
}

interface BodyReadFailure {
  ok: false;
  status: 400 | 413;
  code: 'INVALID_JSON' | 'PAYLOAD_TOO_LARGE';
  message: string;
}

type BodyReadResult = BodyReadSuccess | BodyReadFailure;

interface DatabaseHealthProbe {
  ping(): Promise<void>;
}

export interface ApiServerDependencies {
  database?: DatabaseHealthProbe | null;
}

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

function applyBaseHeaders(
  response: ServerResponse,
  requestId: string,
): void {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Request-Id', requestId);
}

function applyCorsHeaders(
  response: ServerResponse,
  origin: string | undefined,
  config: ApiConfig,
): void {
  if (origin !== config.webOrigin) return;

  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Vary', 'Origin');
}

function sendJson(
  response: ServerResponse,
  requestId: string,
  routeResponse: ApiRouteResponse,
): void {
  applyBaseHeaders(response, requestId);

  if (routeResponse.headers) {
    for (const [name, value] of Object.entries(routeResponse.headers)) {
      response.setHeader(name, value);
    }
  }

  response.statusCode = routeResponse.status;

  if (routeResponse.status === 204) {
    response.end();
    return;
  }

  response.end(JSON.stringify(routeResponse.body));
}

async function readJsonBody(
  request: IncomingMessage,
  limitBytes: number,
): Promise<BodyReadResult> {
  const method = request.method?.toUpperCase() ?? 'GET';

  if (!METHODS_WITH_BODY.has(method)) {
    return {
      ok: true,
      body: undefined,
    };
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk)
      ? chunk
      : Buffer.from(chunk);

    totalBytes += buffer.byteLength;

    if (totalBytes > limitBytes) {
      return {
        ok: false,
        status: 413,
        code: 'PAYLOAD_TOO_LARGE',
        message: 'O corpo da requisição ultrapassou o limite permitido.',
      };
    }

    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    return {
      ok: true,
      body: undefined,
    };
  }

  const contentType = request.headers['content-type'] ?? '';

  if (!contentType.toLowerCase().includes('application/json')) {
    return {
      ok: false,
      status: 400,
      code: 'INVALID_JSON',
      message: 'Requisições com corpo devem usar application/json.',
    };
  }

  try {
    return {
      ok: true,
      body: JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown,
    };
  } catch {
    return {
      ok: false,
      status: 400,
      code: 'INVALID_JSON',
      message: 'O corpo JSON da requisição é inválido.',
    };
  }
}

function getRequestOrigin(request: IncomingMessage): string | undefined {
  const origin = request.headers.origin;

  return Array.isArray(origin) ? origin[0] : origin;
}

function handleCorsPreflight(
  request: IncomingMessage,
  response: ServerResponse,
  requestId: string,
  config: ApiConfig,
): boolean {
  if (request.method?.toUpperCase() !== 'OPTIONS') return false;

  const origin = getRequestOrigin(request);

  applyBaseHeaders(response, requestId);

  if (origin !== config.webOrigin) {
    response.statusCode = 403;
    response.end(JSON.stringify({
      error: {
        code: 'ORIGIN_NOT_ALLOWED',
        message: 'Origem não permitida pela API do CodeMpi.',
        requestId,
      },
    }));
    return true;
  }

  applyCorsHeaders(response, origin, config);
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type',
  );
  response.setHeader('Access-Control-Max-Age', '600');
  response.statusCode = 204;
  response.end();

  return true;
}

async function getDatabaseHealth(
  database: DatabaseHealthProbe | null | undefined,
): Promise<DatabaseHealthStatus> {
  if (!database) return 'not_configured';

  try {
    await database.ping();
    return 'ok';
  } catch {
    return 'unavailable';
  }
}

export function createApiServer(
  config: ApiConfig,
  dependencies: ApiServerDependencies = {},
): Server {
  return createServer(async (request, response) => {
    const requestId = randomUUID();
    const origin = getRequestOrigin(request);

    if (handleCorsPreflight(
      request,
      response,
      requestId,
      config,
    )) {
      return;
    }

    applyCorsHeaders(response, origin, config);

    if (origin && origin !== config.webOrigin) {
      sendJson(response, requestId, {
        status: 403,
        body: {
          error: {
            code: 'ORIGIN_NOT_ALLOWED',
            message: 'Origem não permitida pela API do CodeMpi.',
            requestId,
          },
        },
      });
      return;
    }

    const bodyResult = await readJsonBody(
      request,
      config.bodyLimitBytes,
    );

    if (!bodyResult.ok) {
      sendJson(response, requestId, {
        status: bodyResult.status,
        body: {
          error: {
            code: bodyResult.code,
            message: bodyResult.message,
            requestId,
          },
        },
      });
      return;
    }

    const host = request.headers.host ?? `${config.host}:${config.port}`;
    const url = new URL(request.url ?? '/', `http://${host}`);

    const databaseHealth = url.pathname === '/health'
      ? await getDatabaseHealth(dependencies.database)
      : undefined;

    const routeResponse = routeApiRequest({
      method: request.method ?? 'GET',
      pathname: url.pathname,
      requestId,
      body: bodyResult.body,
      databaseHealth,
    });

    sendJson(response, requestId, routeResponse);
  });
}
