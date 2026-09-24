import { browserPersistence, STORAGE_KEYS, type PersistenceAdapter } from './persistence';
import type { LocalIdentity, LocalUserProfile, UserSession } from '../domain/user';

interface EnsureLocalIdentityOptions {
  persistence?: PersistenceAdapter;
  now?: () => string;
  createId?: () => string;
}

function isLocalUserProfile(value: unknown): value is LocalUserProfile {
  if (!value || typeof value !== 'object') return false;

  const user = value as Partial<LocalUserProfile>;

  return (
    user.kind === 'local'
    && typeof user.id === 'string'
    && user.id.length > 0
    && typeof user.createdAt === 'string'
    && user.createdAt.length > 0
  );
}

function isUserSession(value: unknown): value is UserSession {
  if (!value || typeof value !== 'object') return false;

  const session = value as Partial<UserSession>;

  return (
    session.kind === 'local'
    && typeof session.userId === 'string'
    && session.userId.length > 0
    && typeof session.startedAt === 'string'
    && session.startedAt.length > 0
  );
}

function createLocalUserId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `local_${crypto.randomUUID()}`;
  }

  const randomPart = Math.random().toString(36).slice(2, 12);
  return `local_${Date.now().toString(36)}_${randomPart}`;
}

export function ensureLocalIdentity(
  options: EnsureLocalIdentityOptions = {},
): LocalIdentity {
  const persistence = options.persistence ?? browserPersistence;
  const now = options.now ?? (() => new Date().toISOString());
  const createId = options.createId ?? createLocalUserId;

  const savedUser = persistence.read<unknown>(STORAGE_KEYS.user);
  const savedSession = persistence.read<unknown>(STORAGE_KEYS.session);

  const user = isLocalUserProfile(savedUser)
    ? savedUser
    : {
        id: createId(),
        kind: 'local' as const,
        createdAt: now(),
      };

  if (!isLocalUserProfile(savedUser)) {
    persistence.write(STORAGE_KEYS.user, user);
  }

  const session = (
    isUserSession(savedSession)
    && savedSession.userId === user.id
  )
    ? savedSession
    : {
        userId: user.id,
        kind: 'local' as const,
        startedAt: now(),
      };

  if (
    !isUserSession(savedSession)
    || savedSession.userId !== user.id
  ) {
    persistence.write(STORAGE_KEYS.session, session);
  }

  return { user, session };
}
