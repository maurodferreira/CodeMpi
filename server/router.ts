export interface ApiRouteRequest {
  method: string;
  pathname: string;
  requestId: string;
  body?: unknown;
}

export interface ApiRouteResponse {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

interface RouteDefinition {
  method: string;
  pathname: string;
  handle(request: ApiRouteRequest): ApiRouteResponse;
}

function notConfigured(
  requestId: string,
  code: string,
  message: string,
): ApiRouteResponse {
  return {
    status: 501,
    body: {
      error: {
        code,
        message,
        requestId,
      },
    },
  };
}

const routes: RouteDefinition[] = [
  {
    method: 'GET',
    pathname: '/health',
    handle(request) {
      return {
        status: 200,
        body: {
          status: 'ok',
          service: 'codempi-api',
          version: '0.1.0',
          requestId: request.requestId,
        },
      };
    },
  },
  {
    method: 'POST',
    pathname: '/auth/sign-in',
    handle(request) {
      return notConfigured(
        request.requestId,
        'AUTH_NOT_CONFIGURED',
        'A autenticação do CodeMpi ainda não foi configurada.',
      );
    },
  },
  {
    method: 'POST',
    pathname: '/auth/sign-out',
    handle(request) {
      return notConfigured(
        request.requestId,
        'AUTH_NOT_CONFIGURED',
        'A autenticação do CodeMpi ainda não foi configurada.',
      );
    },
  },
  {
    method: 'GET',
    pathname: '/me',
    handle(request) {
      return notConfigured(
        request.requestId,
        'AUTH_NOT_CONFIGURED',
        'A autenticação do CodeMpi ainda não foi configurada.',
      );
    },
  },
  {
    method: 'POST',
    pathname: '/sync/bootstrap',
    handle(request) {
      return notConfigured(
        request.requestId,
        'SYNC_NOT_CONFIGURED',
        'A sincronização do CodeMpi ainda não foi configurada.',
      );
    },
  },
  {
    method: 'GET',
    pathname: '/sync/snapshot',
    handle(request) {
      return notConfigured(
        request.requestId,
        'SYNC_NOT_CONFIGURED',
        'A sincronização do CodeMpi ainda não foi configurada.',
      );
    },
  },
  {
    method: 'PUT',
    pathname: '/sync/snapshot',
    handle(request) {
      return notConfigured(
        request.requestId,
        'SYNC_NOT_CONFIGURED',
        'A sincronização do CodeMpi ainda não foi configurada.',
      );
    },
  },
];

export function routeApiRequest(
  request: ApiRouteRequest,
): ApiRouteResponse {
  const method = request.method.toUpperCase();

  const route = routes.find(
    (candidate) => (
      candidate.method === method
      && candidate.pathname === request.pathname
    ),
  );

  if (route) {
    return route.handle({
      ...request,
      method,
    });
  }

  const allowedMethods = routes
    .filter((candidate) => candidate.pathname === request.pathname)
    .map((candidate) => candidate.method);

  if (allowedMethods.length > 0) {
    return {
      status: 405,
      headers: {
        Allow: allowedMethods.join(', '),
      },
      body: {
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Método HTTP não permitido para esta rota.',
          requestId: request.requestId,
        },
      },
    };
  }

  return {
    status: 404,
    body: {
      error: {
        code: 'NOT_FOUND',
        message: 'Rota não encontrada.',
        requestId: request.requestId,
      },
    },
  };
}
