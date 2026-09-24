export interface ApiConfig {
  host: string;
  port: number;
  webOrigin: string;
  bodyLimitBytes: number;
  nodeEnv: string;
}

type ApiEnvironment = Record<string, string | undefined>;

function parseInteger(
  value: string | undefined,
  fallback: number,
  label: string,
  min: number,
  max: number,
): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(
      `${label} deve ser um número inteiro entre ${min} e ${max}.`,
    );
  }

  return parsed;
}

function normalizeOrigin(value: string | undefined): string {
  const candidate = value?.trim() || 'http://localhost:5173';

  try {
    const url = new URL(candidate);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error();
    }

    return url.origin;
  } catch {
    throw new Error(
      'CODEMPI_WEB_ORIGIN deve ser uma origem HTTP/HTTPS válida.',
    );
  }
}

export function readApiConfig(
  env: ApiEnvironment = process.env,
): ApiConfig {
  return {
    host: env.CODEMPI_API_HOST?.trim() || '127.0.0.1',
    port: parseInteger(
      env.CODEMPI_API_PORT,
      3001,
      'CODEMPI_API_PORT',
      1,
      65535,
    ),
    webOrigin: normalizeOrigin(env.CODEMPI_WEB_ORIGIN),
    bodyLimitBytes: parseInteger(
      env.CODEMPI_API_BODY_LIMIT,
      65_536,
      'CODEMPI_API_BODY_LIMIT',
      1_024,
      1_048_576,
    ),
    nodeEnv: env.NODE_ENV?.trim() || 'development',
  };
}
