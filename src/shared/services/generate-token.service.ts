import * as crypto from 'crypto';

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex'); // Gera um token de 64 caracteres
}
