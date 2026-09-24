import {
  Pool,
  type PoolClient,
  type PoolConfig,
  type QueryResultRow,
} from 'pg';
import type {
  Database,
  DatabaseClient,
  DatabaseQueryResult,
} from './types.js';

export interface PostgresDatabase extends Database {
  ping(): Promise<void>;
  close(): Promise<void>;
}

export interface CreatePostgresDatabaseOptions {
  maxConnections?: number;
  connectionTimeoutMs?: number;
  idleTimeoutMs?: number;
  onUnexpectedError?: (error: Error) => void;
}

async function queryWithClient<Row>(
  client: Pool | PoolClient,
  sql: string,
  params: readonly unknown[] = [],
): Promise<DatabaseQueryResult<Row>> {
  const result = await client.query<QueryResultRow>(
    sql,
    [...params],
  );

  return {
    rows: result.rows as Row[],
    rowCount: result.rowCount ?? 0,
  };
}

function createTransactionClient(
  client: PoolClient,
): DatabaseClient {
  return {
    query<Row = Record<string, unknown>>(
      sql: string,
      params: readonly unknown[] = [],
    ) {
      return queryWithClient<Row>(client, sql, params);
    },
  };
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

  if (options.onUnexpectedError) {
    pool.on('error', options.onUnexpectedError);
  }

  return {
    query<Row = Record<string, unknown>>(
      sql: string,
      params: readonly unknown[] = [],
    ) {
      return queryWithClient<Row>(pool, sql, params);
    },

    async transaction<T>(
      work: (client: DatabaseClient) => Promise<T>,
    ): Promise<T> {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const result = await work(
          createTransactionClient(client),
        );

        await client.query('COMMIT');

        return result;
      } catch (error) {
        try {
          await client.query('ROLLBACK');
        } catch {
          // Mantém o erro original da transação.
        }

        throw error;
      } finally {
        client.release();
      }
    },

    async ping() {
      await pool.query('SELECT 1');
    },

    async close() {
      await pool.end();
    },
  };
}
