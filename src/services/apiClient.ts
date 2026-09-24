export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  accessToken?: string;
  signal?: AbortSignal;
}

export interface ApiClient {
  request<TResponse>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<TResponse>;
}

interface CreateApiClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

export function createApiClient({
  baseUrl,
  fetchImpl = fetch,
}: CreateApiClientOptions): ApiClient {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  return {
    async request<TResponse>(
      path: string,
      options: ApiRequestOptions = {},
    ): Promise<TResponse> {
      const response = await fetchImpl(
        `${normalizedBaseUrl}/${path.replace(/^\/+/, '')}`,
        {
          method: options.method ?? 'GET',
          headers: {
            Accept: 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
            ...(options.accessToken
              ? { Authorization: `Bearer ${options.accessToken}` }
              : {}),
          },
          body: options.body === undefined
            ? undefined
            : JSON.stringify(options.body),
          signal: options.signal,
        },
      );

      const contentType = response.headers.get('content-type') ?? '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message = (
          payload
          && typeof payload === 'object'
          && 'message' in payload
          && typeof payload.message === 'string'
        )
          ? payload.message
          : `A API respondeu com status ${response.status}.`;

        throw new ApiError(response.status, message, payload);
      }

      return payload as TResponse;
    },
  };
}
