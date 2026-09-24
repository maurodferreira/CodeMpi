import type {
  AuthenticatedSession,
  CloudUserProfile,
} from '../domain/cloud';
import type { ApiClient } from './apiClient';

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: CloudUserProfile;
  session: AuthenticatedSession;
}

export interface AuthRepository {
  signUp(credentials: SignUpCredentials): Promise<AuthResult>;
  signIn(credentials: SignInCredentials): Promise<AuthResult>;
  signOut(accessToken: string): Promise<void>;
  getCurrentUser(accessToken: string): Promise<CloudUserProfile>;
}

export function createAuthRepository(api: ApiClient): AuthRepository {
  return {
    signUp(credentials) {
      return api.request<AuthResult>('auth/sign-up', {
        method: 'POST',
        body: credentials,
      });
    },

    signIn(credentials) {
      return api.request<AuthResult>('auth/sign-in', {
        method: 'POST',
        body: credentials,
      });
    },

    async signOut(accessToken) {
      await api.request('auth/sign-out', {
        method: 'POST',
        accessToken,
      });
    },

    getCurrentUser(accessToken) {
      return api.request<CloudUserProfile>('me', {
        accessToken,
      });
    },
  };
}
