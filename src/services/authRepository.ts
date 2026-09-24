import type {
  AuthenticatedSession,
  CloudUserProfile,
} from '../domain/cloud';
import type { ApiClient } from './apiClient';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: CloudUserProfile;
  session: AuthenticatedSession;
}

export interface AuthRepository {
  signIn(credentials: SignInCredentials): Promise<AuthResult>;
  signOut(accessToken: string): Promise<void>;
  getCurrentUser(accessToken: string): Promise<CloudUserProfile>;
}

export function createAuthRepository(api: ApiClient): AuthRepository {
  return {
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
