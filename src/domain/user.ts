export interface LocalUserProfile {
  id: string;
  kind: 'local';
  createdAt: string;
}

export interface UserSession {
  userId: string;
  kind: 'local';
  startedAt: string;
}

export interface LocalIdentity {
  user: LocalUserProfile;
  session: UserSession;
}
