import { loadEnvFile } from 'node:process';
import { createAuthService } from './auth/authService.js';
import { createPostgresAuthDataStore } from './auth/authDataStore.js';
import { readApiConfig } from './config.js';
import { createPostgresDatabase } from './database/postgres.js';
import { createApiServer } from './server.js';

try {
  loadEnvFile('.env.local');
} catch (error: unknown) {
  const code = (
    error
    && typeof error === 'object'
    && 'code' in error
  )
    ? error.code
    : undefined;

  if (code !== 'ENOENT') {
    throw error;
  }
}

const config = readApiConfig();

const database = config.databaseUrl
  ? createPostgresDatabase(config.databaseUrl, {
      onUnexpectedError(error) {
        process.stderr.write(
          `Erro inesperado no pool PostgreSQL: ${error.message}\n`,
        );
      },
    })
  : null;

const auth = database
  ? createAuthService({
      store: createPostgresAuthDataStore(database),
      sessionTtlHours: config.sessionTtlHours,
    })
  : null;

const server = createApiServer(config, {
  database,
  auth,
});

server.listen(config.port, config.host, () => {
  process.stdout.write(
    `CodeMpi API pronta em http://${config.host}:${config.port}\n`,
  );

  process.stdout.write(
    database
      ? 'PostgreSQL configurado para esta instância.\n'
      : 'PostgreSQL não configurado nesta instância.\n',
  );
});

let shuttingDown = false;

async function closeServer(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;

  shuttingDown = true;
  process.stdout.write(
    `Encerrando CodeMpi API (${signal})...\n`,
  );

  try {
    await closeServer();
    await database?.close();
  } catch (error: unknown) {
    const message = error instanceof Error
      ? error.message
      : 'erro desconhecido';

    process.stderr.write(
      `Falha ao encerrar a API: ${message}\n`,
    );
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
