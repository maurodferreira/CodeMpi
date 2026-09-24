import { loadEnvFile } from 'node:process';
import { readApiConfig } from './config.js';
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
const server = createApiServer(config);

server.listen(config.port, config.host, () => {
  process.stdout.write(
    `CodeMpi API pronta em http://${config.host}:${config.port}\n`,
  );
});

let shuttingDown = false;

function shutdown(signal: string): void {
  if (shuttingDown) return;

  shuttingDown = true;
  process.stdout.write(
    `Encerrando CodeMpi API (${signal})...\n`,
  );

  server.close((error) => {
    if (error) {
      process.stderr.write(
        `Falha ao encerrar a API: ${error.message}\n`,
      );
      process.exitCode = 1;
    }

    process.exit();
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
