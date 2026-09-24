export interface DatabaseQueryResult<Row = Record<string, unknown>> {
  rows: Row[];
  rowCount: number;
}

export interface DatabaseClient {
  query<Row = Record<string, unknown>>(
    sql: string,
    params?: readonly unknown[],
  ): Promise<DatabaseQueryResult<Row>>;
}

export interface Database extends DatabaseClient {
  transaction<T>(
    work: (client: DatabaseClient) => Promise<T>,
  ): Promise<T>;
}
