import { useState } from 'react';
import { ensureLocalIdentity } from '../services/userRepository';

export function useUserSession() {
  const [identity] = useState(() => ensureLocalIdentity());

  return {
    user: identity.user,
    session: identity.session,
    isLocalUser: identity.user.kind === 'local',
  };
}
