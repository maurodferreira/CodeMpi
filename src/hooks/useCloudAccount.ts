import { useCallback, useMemo, useState } from 'react';
import type { CloudIdentity, CloudSnapshot } from '../domain/cloud';
import type { AppPreferences } from '../domain/preferences';
import type { LocalIdentity } from '../domain/user';
import type { StoreData, ThemeKey } from '../types';
import { cloudConfig } from '../config/cloud';
import {
  connectCloudAccount,
  disconnectCloudAccount,
  type CloudAuthMode,
} from '../services/cloudAccountService';
import { createCloudServices } from '../services/cloudServices';

export type CloudAccountNoticeKind = 'success' | 'warning' | 'error';

export interface CloudAccountNotice {
  kind: CloudAccountNoticeKind;
  message: string;
}

export interface CloudAccountCredentials {
  email: string;
  password: string;
  displayName?: string;
}

interface UseCloudAccountOptions {
  localIdentity: LocalIdentity;
  progress: StoreData;
  preferences: AppPreferences;
  theme: ThemeKey;
}

export interface CloudAccountController {
  enabled: boolean;
  identity: CloudIdentity | null;
  snapshot: CloudSnapshot | null;
  isBusy: boolean;
  notice: CloudAccountNotice | null;
  connect(mode: CloudAuthMode, credentials: CloudAccountCredentials): Promise<void>;
  signOut(): Promise<void>;
  clearNotice(): void;
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Não foi possível conectar a conta CodeMpi.';
}

export function useCloudAccount({
  localIdentity,
  progress,
  preferences,
  theme,
}: UseCloudAccountOptions): CloudAccountController {
  const services = useMemo(
    () => createCloudServices(cloudConfig),
    [],
  );

  const [identity, setIdentity] = useState<CloudIdentity | null>(
    () => services?.session.load() ?? null,
  );
  const [snapshot, setSnapshot] = useState<CloudSnapshot | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [notice, setNotice] = useState<CloudAccountNotice | null>(null);

  const connect = useCallback(async (
    mode: CloudAuthMode,
    credentials: CloudAccountCredentials,
  ) => {
    if (!services) {
      setNotice({
        kind: 'warning',
        message: 'A sincronização online está desativada nesta instalação.',
      });
      return;
    }

    setIsBusy(true);
    setNotice(null);

    try {
      const result = await connectCloudAccount({
        mode,
        ...credentials,
        services,
        localIdentity,
        progress,
        preferences,
        theme,
      });

      setIdentity(result.identity);
      setSnapshot(result.snapshot);

      if (result.syncError) {
        setNotice({
          kind: 'warning',
          message: `Conta conectada, mas o envio do progresso ainda não foi concluído: ${result.syncError.message}`,
        });
        return;
      }

      if (result.snapshot?.sourceLocalUserId === localIdentity.user.id) {
        setNotice({
          kind: 'success',
          message: 'Conta conectada. Seu progresso local foi preservado e registrado na cloud.',
        });
        return;
      }

      setNotice({
        kind: 'success',
        message: 'Conta conectada. Já existe progresso nessa conta e nada deste dispositivo foi substituído.',
      });
    } catch (error) {
      setNotice({
        kind: 'error',
        message: errorMessage(error),
      });
    } finally {
      setIsBusy(false);
    }
  }, [
    localIdentity,
    preferences,
    progress,
    services,
    theme,
  ]);

  const signOut = useCallback(async () => {
    if (!services || !identity) return;

    setIsBusy(true);
    setNotice(null);

    const remoteError = await disconnectCloudAccount(services, identity);

    setIdentity(null);
    setSnapshot(null);
    setIsBusy(false);
    setNotice({
      kind: remoteError ? 'warning' : 'success',
      message: remoteError
        ? 'A conta foi removida deste dispositivo, mas a API não confirmou o encerramento da sessão.'
        : 'Conta desconectada deste dispositivo. Seu progresso local continua aqui.',
    });
  }, [identity, services]);

  return {
    enabled: Boolean(services),
    identity,
    snapshot,
    isBusy,
    notice,
    connect,
    signOut,
    clearNotice: () => setNotice(null),
  };
}
