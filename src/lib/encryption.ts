import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// AES-256-GCM provides both encryption and authentication
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Derives a 256-bit key from the master secret using scrypt.
 * This adds an extra layer of security even if the secret is compromised.
 */
async function deriveKey(secret: string, salt: Buffer): Promise<Buffer> {
  return (await scryptAsync(secret, salt, KEY_LENGTH)) as Buffer;
}

/**
 * Get the encryption secret from environment.
 * Throws if not configured (fail fast on misconfiguration).
 */
function getEncryptionSecret(): string {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET environment variable is required');
  }
  if (secret.length < 32) {
    throw new Error('ENCRYPTION_SECRET must be at least 32 characters');
  }
  return secret;
}

/**
 * Encrypts a string value using AES-256-GCM.
 *
 * Returns format: base64(salt:iv:authTag:ciphertext)
 *
 * @param plaintext - The string to encrypt
 * @returns Encrypted string (base64 encoded)
 */
export async function encrypt(plaintext: string): Promise<string> {
  const secret = getEncryptionSecret();

  // Generate random salt and IV for each encryption
  const salt = randomBytes(16);
  const iv = randomBytes(IV_LENGTH);

  // Derive key from secret + salt
  const key = await deriveKey(secret, salt);

  // Create cipher and encrypt
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Combine all components: salt + iv + authTag + ciphertext
  const combined = Buffer.concat([salt, iv, authTag, encrypted]);

  return combined.toString('base64');
}

/**
 * Decrypts a string encrypted with encrypt().
 *
 * @param encrypted - The encrypted string (base64 encoded)
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails (wrong key, tampered data, etc.)
 */
export async function decrypt(encrypted: string): Promise<string> {
  const secret = getEncryptionSecret();

  // Decode from base64
  const combined = Buffer.from(encrypted, 'base64');

  // Extract components
  const salt = combined.subarray(0, 16);
  const iv = combined.subarray(16, 16 + IV_LENGTH);
  const authTag = combined.subarray(16 + IV_LENGTH, 16 + IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = combined.subarray(16 + IV_LENGTH + AUTH_TAG_LENGTH);

  // Derive key from secret + salt
  const key = await deriveKey(secret, salt);

  // Create decipher and decrypt
  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  try {
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch (error) {
    throw new Error('Decryption failed: data may be corrupted or tampered');
  }
}

/**
 * Generates a secure random secret suitable for ENCRYPTION_SECRET.
 * Use this to generate the initial secret.
 */
export function generateEncryptionSecret(): string {
  return randomBytes(32).toString('base64');
}
