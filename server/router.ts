import {
  AuthServiceError,
  type AuthService,
} from './auth/authService.js';

export type DatabaseHealthStatus =
  | 'not_configured'
  | 'ok'
  | 'unavailable';

export interface ApiRouteRequest {
  method: string;
  pathname: string;
  requestId: string;
  body?: unknown;
  authorization?: string;
  databaseHealth?: DatabaseHealthStatus;
}

export interface ApiRouteResponse {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

export interface ApiRouteDependencies {
  auth?: AuthService | null;
}

type RouteHandlerResult =
  | ApiRouteResponse
  | Promise<ApiRouteResponse>;

interface RouteDefinition {
  method: string;
  pathname: string;
  handle(
    request: ApiRouteRequest,
    dependencies: ApiRouteDependencies,
  ): RouteHandlerResult;
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

function authUnavailable(
  requestId: string,
): ApiRouteResponse {
  return {
    status: 503,
    body: {
      error: {
        code: 'AUTH_UNAVAILABLE',
        message: 'A autenticação não está disponível nesta instância.',
        requestId,
      },
    },
  };
}

function getBearerToken(
  authorization: string | undefined,
): string | null {
  if (!authorization) return null;

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();

  return token || null;
}

async function handleAuthOperation(
  requestId: string,
  operation: () => Promise<unknown>,
  successStatus = 200,
): Promise<ApiRouteResponse> {
  try {
    const body = await operation();

    return {
      status: successStatus,
      body,
    };
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return {
        status: error.status,
        body: {
          error: {
            code: error.code,
            message: error.message,
            requestId,
          },
        },
      };
    }

    throw error;
  }
}

const routes: RouteDefinition[] = [
  {
    method: 'GET',
    pathname: '/health',
    handle(request) {
      const databaseHealth =
        request.databaseHealth ?? 'not_configured';
      const databaseUnavailable =
        databaseHealth === 'unavailable';

      return {
        status: databaseUnavailable ? 503 : 200,
        body: {
          status: databaseUnavailable ? 'degraded' : 'ok',
          service: 'codempi-api',
          version: '0.1.0',
          database: {
            configured: databaseHealth !== 'not_configured',
            status: databaseHealth,
          },
          requestId: request.requestId,
        },
      };
    },
  },
  {
    method: 'POST',
    pathname: '/auth/sign-up',
    handle(request, dependencies) {
      if (!dependencies.auth) {
        return authUnavailable(request.requestId);
      }

      const body = (
        request.body
        && typeof request.body === 'object'
      )
        ? request.body as Record<string, unknown>
        : {};

      return handleAuthOperation(
        request.requestId,
        () => dependencies.auth!.signUp({
          email: body.email as string,
          password: body.password as string,
          displayName: body.displayName as string | undefined,
        }),
        201,
      );
    },
  },
  {
    method: 'POST',
    pathname: '/auth/sign-in',
    handle(request, dependencies) {
      if (!dependencies.auth) {
        return authUnavailable(request.requestId);
      }

      const body = (
        request.body
        && typeof request.body === 'object'
      )
        ? request.body as Record<string, unknown>
        : {};

      return handleAuthOperation(
        request.requestId,
        () => dependencies.auth!.signIn({
          email: body.email as string,
          password: body.password as string,
        }),
      );
    },
  },
  {
    method: 'POST',
    pathname: '/auth/sign-out',
    handle(request, dependencies) {
      if (!dependencies.auth) {
        return authUnavailable(request.requestId);
      }

      const token = getBearerToken(request.authorization);

      return handleAuthOperation(
        request.requestId,
        async () => {
          await dependencies.auth!.signOut(token ?? '');
          return {
            signedOut: true,
          };
        },
      );
    },
  },
  {
    method: 'GET',
    pathname: '/me',
    handle(request, dependencies) {
      if (!dependencies.auth) {
        return authUnavailable(request.requestId);
      }

      const token = getBearerToken(request.authorization);

      return handleAuthOperation(
        request.requestId,
        () => dependencies.auth!.getCurrentUser(token ?? ''),
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
  dependencies: ApiRouteDependencies = {},
): RouteHandlerResult {
  const method = request.method.toUpperCase();

  const route = routes.find(
    (candidate) => (
      candidate.method === method
      && candidate.pathname === request.pathname
    ),
  );

  if (route) {
    return route.handle(
      {
        ...request,
        method,
      },
      dependencies,
    );
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
