import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, encodedHash: string): Promise<boolean>;
}

export const passwordHasher: PasswordHasher = {
  async hash(password) {
    const salt = randomBytes(SALT_LENGTH);
    const derivedKey = await scrypt(
      password,
      salt,
      KEY_LENGTH,
      {
        N: SCRYPT_N,
        r: SCRYPT_R,
        p: SCRYPT_P,
      },
    ) as Buffer;

    return [
      'scrypt',
      SCRYPT_N,
      SCRYPT_R,
      SCRYPT_P,
      salt.toString('base64url'),
      derivedKey.toString('base64url'),
    ].join('$');
  },

  async verify(password, encodedHash) {
    const [
      algorithm,
      nValue,
      rValue,
      pValue,
      saltValue,
      keyValue,
    ] = encodedHash.split('$');

    if (
      algorithm !== 'scrypt'
      || !nValue
      || !rValue
      || !pValue
      || !saltValue
      || !keyValue
    ) {
      return false;
    }

    const N = Number(nValue);
    const r = Number(rValue);
    const p = Number(pValue);

    if (
      N !== SCRYPT_N
      || r !== SCRYPT_R
      || p !== SCRYPT_P
    ) {
      return false;
    }

    try {
      const salt = Buffer.from(saltValue, 'base64url');
      const expectedKey = Buffer.from(keyValue, 'base64url');

      if (
        salt.length !== SALT_LENGTH
        || expectedKey.length !== KEY_LENGTH
      ) {
        return false;
      }

      const actualKey = await scrypt(
        password,
        salt,
        expectedKey.length,
        { N, r, p },
      ) as Buffer;

      return timingSafeEqual(actualKey, expectedKey);
    } catch {
      return false;
    }
  },
};
