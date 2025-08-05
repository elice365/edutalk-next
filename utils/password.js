import argon2 from 'argon2';
import crypto from 'crypto';

export async function hashPwd(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await argon2.hash(password, {
    salt: Buffer.from(salt, 'hex'),
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4
  });
  return { hash, salt };
}

export async function verifyPwd(password, hash) {
  return argon2.verify(hash, password);
}

export function genToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function genEmailToken() {
  return crypto.randomBytes(20).toString('hex');
}