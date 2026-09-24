export interface CloudConfig {
  enabled: boolean;
  apiBaseUrl: string | null;
}

type CloudEnv = {
  VITE_CODEMPI_CLOUD_ENABLED?: string;
  VITE_CODEMPI_API_URL?: string;
};

function parseEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function normalizeApiBaseUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();

  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }

    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function readCloudConfig(
  env: CloudEnv = import.meta.env as unknown as CloudEnv,
): CloudConfig {
  const apiBaseUrl = normalizeApiBaseUrl(env.VITE_CODEMPI_API_URL);
  const requestedEnabled = parseEnabled(env.VITE_CODEMPI_CLOUD_ENABLED);

  return {
    enabled: requestedEnabled && apiBaseUrl !== null,
    apiBaseUrl,
  };
}

export const cloudConfig = readCloudConfig();
