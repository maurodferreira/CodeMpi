export interface DatabaseUser {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSession {
  id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

export interface DatabaseProgressSnapshot {
  userId: string;
  snapshotVersion: number;
  revision: number;
  sourceLocalUserId: string | null;
  progress: unknown;
  preferences: unknown;
  theme: 'green' | 'carbon' | 'violet' | 'crimson' | 'ocean';
  createdAt: string;
  updatedAt: string;
}
