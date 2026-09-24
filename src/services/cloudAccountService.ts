import type {
  CloudIdentity,
  CloudSnapshot,
} from '../domain/cloud';
import type { AppPreferences } from '../domain/preferences';
import type { LocalIdentity } from '../domain/user';
import type { StoreData, ThemeKey } from '../types';
import { createLocalToCloudBootstrapPayload } from './cloudMigration';
import type { CloudServices } from './cloudServices';

export type CloudAuthMode = 'sign-up' | 'sign-in';

export interface ConnectCloudAccountInput {
  mode: CloudAuthMode;
  email: string;
  password: string;
  displayName?: string;
  services: CloudServices;
  localIdentity: LocalIdentity;
  progress: StoreData;
  preferences: AppPreferences;
  theme: ThemeKey;
}

export interface ConnectCloudAccountResult {
  identity: CloudIdentity;
  snapshot: CloudSnapshot | null;
  syncError: Error | null;
}

function asError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error('Não foi possível concluir a sincronização da conta.');
}

export async function connectCloudAccount({
  mode,
  email,
  password,
  displayName,
  services,
  localIdentity,
  progress,
  preferences,
  theme,
}: ConnectCloudAccountInput): Promise<ConnectCloudAccountResult> {
  const authResult = mode === 'sign-up'
    ? await services.auth.signUp({
        email,
        password,
        ...(displayName?.trim()
          ? { displayName: displayName.trim() }
          : {}),
      })
    : await services.auth.signIn({
        email,
        password,
      });

  const identity: CloudIdentity = {
    user: authResult.user,
    session: authResult.session,
  };

  if (!services.session.save(identity)) {
    try {
      await services.auth.signOut(identity.session.accessToken);
    } catch {
      // A sessão local não foi persistida; a revogação remota é best effort.
    }

    throw new Error('Não foi possível salvar a sessão da conta neste dispositivo.');
  }

  try {
    const snapshot = await services.sync.bootstrapLocalProfile(
      identity.session.accessToken,
      createLocalToCloudBootstrapPayload({
        identity: localIdentity,
        progress,
        preferences,
        theme,
      }),
    );

    return {
      identity,
      snapshot,
      syncError: null,
    };
  } catch (error) {
    return {
      identity,
      snapshot: null,
      syncError: asError(error),
    };
  }
}

export async function disconnectCloudAccount(
  services: CloudServices,
  identity: CloudIdentity,
): Promise<Error | null> {
  let remoteError: Error | null = null;

  try {
    await services.auth.signOut(identity.session.accessToken);
  } catch (error) {
    remoteError = asError(error);
  } finally {
    services.session.clear();
  }

  return remoteError;
}
