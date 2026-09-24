import {
  Pool,
  type PoolConfig,
  type QueryResultRow,
} from 'pg';
import type {
  DatabaseClient,
  DatabaseQueryResult,
} from './types.js';

export interface PostgresDatabase extends DatabaseClient {
  ping(): Promise<void>;
  close(): Promise<void>;
}

export interface CreatePostgresDatabaseOptions {
  maxConnections?: number;
  connectionTimeoutMs?: number;
  idleTimeoutMs?: number;
}

export function createPostgresDatabase(
  databaseUrl: string,
  options: CreatePostgresDatabaseOptions = {},
): PostgresDatabase {
  const config: PoolConfig = {
    connectionString: databaseUrl,
    max: options.maxConnections ?? 10,
    connectionTimeoutMillis: options.connectionTimeoutMs ?? 5_000,
    idleTimeoutMillis: options.idleTimeoutMs ?? 30_000,
    application_name: 'codempi-api',
  };

  const pool = new Pool(config);

  return {
    async query<Row = Record<string, unknown>>(
      sql: string,
      params: readonly unknown[] = [],
    ): Promise<DatabaseQueryResult<Row>> {
      const result = await pool.query<QueryResultRow>(
        sql,
        [...params],
      );

      return {
        rows: result.rows as Row[],
        rowCount: result.rowCount ?? 0,
      };
    },

    async ping() {
      await pool.query('SELECT 1');
    },

    async close() {
      await pool.end();
    },
  };
}
