import {
  createPostgresSessionRepository,
  createPostgresUserRepository,
} from '../database/postgresRepositories.js';
import type {
  SessionDatabaseRepository,
  UserDatabaseRepository,
} from '../database/repositories.js';
import type {
  Database,
  DatabaseClient,
} from '../database/types.js';

export interface AuthRepositories {
  users: UserDatabaseRepository;
  sessions: SessionDatabaseRepository;
}

export interface AuthDataStore extends AuthRepositories {
  transaction<T>(
    work: (repositories: AuthRepositories) => Promise<T>,
  ): Promise<T>;
}

function createRepositories(
  database: DatabaseClient,
): AuthRepositories {
  return {
    users: createPostgresUserRepository(database),
    sessions: createPostgresSessionRepository(database),
  };
}

export function createPostgresAuthDataStore(
  database: Database,
): AuthDataStore {
  return {
    ...createRepositories(database),

    transaction(work) {
      return database.transaction((client) => (
        work(createRepositories(client))
      ));
    },
  };
}
