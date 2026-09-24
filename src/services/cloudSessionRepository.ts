import type {
  AuthenticatedSession,
  CloudIdentity,
  CloudUserProfile,
} from '../domain/cloud';
import {
  browserSessionPersistence,
  STORAGE_KEYS,
  type PersistenceAdapter,
} from './persistence';

export interface CloudSessionRepository {
  load(): CloudIdentity | null;
  save(identity: CloudIdentity): boolean;
  clear(): boolean;
}

interface CreateCloudSessionRepositoryOptions {
  persistence?: PersistenceAdapter;
  now?: () => number;
}

function isValidTimestamp(value: unknown): value is string {
  return (
    typeof value === 'string'
    && value.length > 0
    && !Number.isNaN(Date.parse(value))
  );
}

function isCloudUserProfile(value: unknown): value is CloudUserProfile {
  if (!value || typeof value !== 'object') return false;

  const user = value as Partial<CloudUserProfile>;

  return (
    user.kind === 'cloud'
    && typeof user.id === 'string'
    && user.id.length > 0
    && typeof user.email === 'string'
    && user.email.includes('@')
    && isValidTimestamp(user.createdAt)
    && (
      user.displayName === undefined
      || typeof user.displayName === 'string'
    )
  );
}

function isAuthenticatedSession(
  value: unknown,
  now: number,
): value is AuthenticatedSession {
  if (!value || typeof value !== 'object') return false;

  const session = value as Partial<AuthenticatedSession>;

  return (
    session.kind === 'cloud'
    && typeof session.userId === 'string'
    && session.userId.length > 0
    && typeof session.accessToken === 'string'
    && session.accessToken.length > 0
    && isValidTimestamp(session.expiresAt)
    && Date.parse(session.expiresAt) > now
  );
}

export function createCloudSessionRepository(
  options: CreateCloudSessionRepositoryOptions = {},
): CloudSessionRepository {
  const persistence = options.persistence ?? browserSessionPersistence;
  const now = options.now ?? (() => Date.now());

  const clear = () => {
    const userRemoved = persistence.remove(STORAGE_KEYS.cloudUser);
    const sessionRemoved = persistence.remove(STORAGE_KEYS.cloudSession);

    return userRemoved || sessionRemoved;
  };

  return {
    load() {
      const user = persistence.read<unknown>(STORAGE_KEYS.cloudUser);
      const session = persistence.read<unknown>(STORAGE_KEYS.cloudSession);

      if (
        !isCloudUserProfile(user)
        || !isAuthenticatedSession(session, now())
        || session.userId !== user.id
      ) {
        clear();
        return null;
      }

      return {
        user,
        session,
      };
    },

    save(identity) {
      if (
        !isCloudUserProfile(identity.user)
        || !isAuthenticatedSession(identity.session, now())
        || identity.session.userId !== identity.user.id
      ) {
        return false;
      }

      const userSaved = persistence.write(
        STORAGE_KEYS.cloudUser,
        identity.user,
      );

      const sessionSaved = persistence.write(
        STORAGE_KEYS.cloudSession,
        identity.session,
      );

      if (!userSaved || !sessionSaved) {
        clear();
        return false;
      }

      return true;
    },

    clear,
  };
}

export const cloudSessionRepository = createCloudSessionRepository();
