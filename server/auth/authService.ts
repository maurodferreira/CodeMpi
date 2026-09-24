import { randomUUID } from 'node:crypto';
import type { DatabaseUser } from '../database/models.js';
import type {
  AuthDataStore,
  AuthRepositories,
} from './authDataStore.js';
import {
  createAccessToken,
  hashAccessToken,
} from './token.js';
import {
  passwordHasher,
  type PasswordHasher,
} from './password.js';

export interface SignUpInput {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthUserProfile {
  id: string;
  kind: 'cloud';
  email: string;
  displayName?: string;
  createdAt: string;
}

export interface AuthenticatedSessionResult {
  userId: string;
  kind: 'cloud';
  accessToken: string;
  expiresAt: string;
}

export interface AuthResult {
  user: AuthUserProfile;
  session: AuthenticatedSessionResult;
}

export type AuthErrorCode =
  | 'INVALID_INPUT'
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_CREDENTIALS'
  | 'UNAUTHORIZED';

export class AuthServiceError extends Error {
  readonly code: AuthErrorCode;
  readonly status: 400 | 401 | 409;

  constructor(
    code: AuthErrorCode,
    status: 400 | 401 | 409,
    message: string,
  ) {
    super(message);
    this.name = 'AuthServiceError';
    this.code = code;
    this.status = status;
  }
}

export interface AuthService {
  signUp(input: SignUpInput): Promise<AuthResult>;
  signIn(input: SignInInput): Promise<AuthResult>;
  getCurrentUser(accessToken: string): Promise<AuthUserProfile>;
  signOut(accessToken: string): Promise<void>;
}

interface CreateAuthServiceOptions {
  store: AuthDataStore;
  sessionTtlHours: number;
  hasher?: PasswordHasher;
  now?: () => Date;
  createId?: () => string;
  createToken?: () => string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 256;
const MAX_EMAIL_LENGTH = 254;
const MAX_DISPLAY_NAME_LENGTH = 80;

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toLowerCase();

  if (
    normalized.length < 5
    || normalized.length > MAX_EMAIL_LENGTH
    || !EMAIL_PATTERN.test(normalized)
  ) {
    return null;
  }

  return normalized;
}

function validatePasswordForSignUp(value: unknown): string {
  if (
    typeof value !== 'string'
    || value.length < MIN_PASSWORD_LENGTH
    || value.length > MAX_PASSWORD_LENGTH
  ) {
    throw new AuthServiceError(
      'INVALID_INPUT',
      400,
      `A senha deve ter entre ${MIN_PASSWORD_LENGTH} e ${MAX_PASSWORD_LENGTH} caracteres.`,
    );
  }

  return value;
}

function validateDisplayName(value: unknown): string | undefined {
  if (value === undefined) return undefined;

  if (typeof value !== 'string') {
    throw new AuthServiceError(
      'INVALID_INPUT',
      400,
      'O nome exibido é inválido.',
    );
  }

  const normalized = value.trim();

  if (
    normalized.length < 1
    || normalized.length > MAX_DISPLAY_NAME_LENGTH
  ) {
    throw new AuthServiceError(
      'INVALID_INPUT',
      400,
      `O nome exibido deve ter entre 1 e ${MAX_DISPLAY_NAME_LENGTH} caracteres.`,
    );
  }

  return normalized;
}

function toUserProfile(user: DatabaseUser): AuthUserProfile {
  return {
    id: user.id,
    kind: 'cloud',
    email: user.email,
    ...(user.displayName
      ? { displayName: user.displayName }
      : {}),
    createdAt: user.createdAt,
  };
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1_000);
}

function isUniqueViolation(error: unknown): boolean {
  return Boolean(
    error
    && typeof error === 'object'
    && 'code' in error
    && error.code === '23505',
  );
}

async function authenticateToken(
  repositories: AuthRepositories,
  accessToken: string,
  now: Date,
): Promise<{
  user: DatabaseUser;
  sessionId: string;
}> {
  if (!accessToken) {
    throw new AuthServiceError(
      'UNAUTHORIZED',
      401,
      'Sessão inválida ou expirada.',
    );
  }

  const session = await repositories.sessions.findActiveByTokenHash(
    hashAccessToken(accessToken),
    now.toISOString(),
  );

  if (!session) {
    throw new AuthServiceError(
      'UNAUTHORIZED',
      401,
      'Sessão inválida ou expirada.',
    );
  }

  const user = await repositories.users.findById(session.userId);

  if (!user) {
    throw new AuthServiceError(
      'UNAUTHORIZED',
      401,
      'Sessão inválida ou expirada.',
    );
  }

  return {
    user,
    sessionId: session.id,
  };
}

export function createAuthService({
  store,
  sessionTtlHours,
  hasher = passwordHasher,
  now = () => new Date(),
  createId = randomUUID,
  createToken = createAccessToken,
}: CreateAuthServiceOptions): AuthService {
  async function createSessionResult(
    repositories: AuthRepositories,
    user: DatabaseUser,
  ): Promise<AuthResult> {
    const accessToken = createToken();
    const createdAt = now();
    const expiresAt = addHours(
      createdAt,
      sessionTtlHours,
    ).toISOString();

    await repositories.sessions.create({
      id: createId(),
      userId: user.id,
      tokenHash: hashAccessToken(accessToken),
      expiresAt,
    });

    return {
      user: toUserProfile(user),
      session: {
        userId: user.id,
        kind: 'cloud',
        accessToken,
        expiresAt,
      },
    };
  }

  return {
    async signUp(input) {
      const email = normalizeEmail(input.email);

      if (!email) {
        throw new AuthServiceError(
          'INVALID_INPUT',
          400,
          'Informe um e-mail válido.',
        );
      }

      const password = validatePasswordForSignUp(input.password);
      const displayName = validateDisplayName(input.displayName);
      const passwordHash = await hasher.hash(password);

      try {
        return await store.transaction(async (repositories) => {
          const existing = await repositories.users.findByEmail(email);

          if (existing) {
            throw new AuthServiceError(
              'EMAIL_ALREADY_EXISTS',
              409,
              'Já existe uma conta com este e-mail.',
            );
          }

          const user = await repositories.users.create({
            id: createId(),
            email,
            passwordHash,
            displayName,
          });

          return createSessionResult(repositories, user);
        });
      } catch (error) {
        if (error instanceof AuthServiceError) {
          throw error;
        }

        if (isUniqueViolation(error)) {
          throw new AuthServiceError(
            'EMAIL_ALREADY_EXISTS',
            409,
            'Já existe uma conta com este e-mail.',
          );
        }

        throw error;
      }
    },

    async signIn(input) {
      const email = normalizeEmail(input.email);

      if (
        !email
        || typeof input.password !== 'string'
        || input.password.length === 0
        || input.password.length > MAX_PASSWORD_LENGTH
      ) {
        throw new AuthServiceError(
          'INVALID_CREDENTIALS',
          401,
          'E-mail ou senha inválidos.',
        );
      }

      const user = await store.users.findByEmail(email);

      if (
        !user
        || !await hasher.verify(input.password, user.passwordHash)
      ) {
        throw new AuthServiceError(
          'INVALID_CREDENTIALS',
          401,
          'E-mail ou senha inválidos.',
        );
      }

      return createSessionResult(store, user);
    },

    async getCurrentUser(accessToken) {
      const authenticated = await authenticateToken(
        store,
        accessToken,
        now(),
      );

      return toUserProfile(authenticated.user);
    },

    async signOut(accessToken) {
      const currentTime = now();
      const authenticated = await authenticateToken(
        store,
        accessToken,
        currentTime,
      );

      await store.sessions.revoke(
        authenticated.sessionId,
        currentTime.toISOString(),
      );
    },
  };
}
