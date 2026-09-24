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
