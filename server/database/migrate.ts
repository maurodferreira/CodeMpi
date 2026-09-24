import { loadEnvFile } from 'node:process';
import { readApiConfig } from '../config.js';
import { runDatabaseMigrations } from './migrations.js';
import { createPostgresDatabase } from './postgres.js';

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

if (!config.databaseUrl) {
  throw new Error(
    'CODEMPI_DATABASE_URL é obrigatória para executar migrations.',
  );
}

const database = createPostgresDatabase(config.databaseUrl);

try {
  await database.ping();

  const executed = await runDatabaseMigrations(database);

  if (executed.length === 0) {
    process.stdout.write(
      'Banco já está atualizado. Nenhuma migration pendente.\n',
    );
  } else {
    process.stdout.write(
      `Migrations aplicadas: ${executed.join(', ')}\n`,
    );
  }
} finally {
  await database.close();
}
