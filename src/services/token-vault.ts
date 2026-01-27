import { db } from '../db/index';
import { tokenVault, type TokenVaultEntry, type NewTokenVaultEntry } from '../db/schema/index';
import { encrypt, decrypt } from '../lib/encryption';
import { eq, and, lt, isNull, or } from 'drizzle-orm';

export interface TokenData {
  value: string;
  expiresAt?: Date;
  identifier?: string;
}

export interface DecryptedToken {
  id: string;
  tenantId: string;
  provider: TokenVaultEntry['provider'];
  tokenType: TokenVaultEntry['tokenType'];
  value: string;
  identifier: string | null;
  expiresAt: Date | null;
  isValid: string;
  lastUsedAt: Date | null;
}

/**
 * TokenVaultService handles secure storage and retrieval of OAuth tokens and API keys.
 *
 * IMPORTANT: This service encrypts all token values before storage.
 * Plaintext tokens should NEVER appear in database or logs.
 */
export class TokenVaultService {
  /**
   * Store a token (encrypts before storage).
   * If token already exists for tenant/provider/type/identifier, updates it.
   */
  async storeToken(
    tenantId: string,
    provider: TokenVaultEntry['provider'],
    tokenType: TokenVaultEntry['tokenType'],
    data: TokenData
  ): Promise<string> {
    const encryptedValue = await encrypt(data.value);

    const existing = await db.query.tokenVault.findFirst({
      where: and(
        eq(tokenVault.tenantId, tenantId),
        eq(tokenVault.provider, provider),
        eq(tokenVault.tokenType, tokenType),
        data.identifier
          ? eq(tokenVault.identifier, data.identifier)
          : isNull(tokenVault.identifier)
      ),
    });

    if (existing) {
      // Update existing token
      await db
        .update(tokenVault)
        .set({
          encryptedValue,
          expiresAt: data.expiresAt,
          isValid: 'true',
          lastError: null,
          lastRefreshedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(tokenVault.id, existing.id));
      return existing.id;
    }

    // Insert new token
    const [inserted] = await db
      .insert(tokenVault)
      .values({
        tenantId,
        provider,
        tokenType,
        identifier: data.identifier,
        encryptedValue,
        expiresAt: data.expiresAt,
        isValid: 'true',
      })
      .returning({ id: tokenVault.id });

    return inserted.id;
  }

  /**
   * Retrieve a token (decrypts on retrieval).
   * Updates lastUsedAt timestamp.
   */
  async getToken(
    tenantId: string,
    provider: TokenVaultEntry['provider'],
    tokenType: TokenVaultEntry['tokenType'],
    identifier?: string
  ): Promise<DecryptedToken | null> {
    const entry = await db.query.tokenVault.findFirst({
      where: and(
        eq(tokenVault.tenantId, tenantId),
        eq(tokenVault.provider, provider),
        eq(tokenVault.tokenType, tokenType),
        identifier
          ? eq(tokenVault.identifier, identifier)
          : isNull(tokenVault.identifier)
      ),
    });

    if (!entry) {
      return null;
    }

    // Update last used timestamp (fire and forget)
    db.update(tokenVault)
      .set({ lastUsedAt: new Date() })
      .where(eq(tokenVault.id, entry.id))
      .catch(() => {}); // Ignore errors on usage tracking

    // Decrypt the value
    const value = await decrypt(entry.encryptedValue);

    return {
      id: entry.id,
      tenantId: entry.tenantId,
      provider: entry.provider,
      tokenType: entry.tokenType,
      value,
      identifier: entry.identifier,
      expiresAt: entry.expiresAt,
      isValid: entry.isValid,
      lastUsedAt: entry.lastUsedAt,
    };
  }

  /**
   * Get access token with automatic refresh check.
   * Returns null if token is expired or invalid.
   * Returns token if valid or if expiring within buffer (caller should refresh).
   */
  async getAccessToken(
    tenantId: string,
    provider: TokenVaultEntry['provider'],
    identifier?: string,
    refreshBufferMinutes: number = 5
  ): Promise<{ token: DecryptedToken; needsRefresh: boolean } | null> {
    const token = await this.getToken(tenantId, provider, 'access_token', identifier);

    if (!token) {
      return null;
    }

    if (token.isValid === 'false') {
      return null;
    }

    const now = new Date();
    const bufferMs = refreshBufferMinutes * 60 * 1000;

    // Check if expired
    if (token.expiresAt && token.expiresAt <= now) {
      // Token is expired, mark as invalid
      await this.markTokenInvalid(token.id, 'Token expired');
      return null;
    }

    // Check if expiring soon
    const needsRefresh = token.expiresAt
      ? token.expiresAt.getTime() - now.getTime() < bufferMs
      : false;

    return { token, needsRefresh };
  }

  /**
   * Get refresh token for a provider.
   */
  async getRefreshToken(
    tenantId: string,
    provider: TokenVaultEntry['provider'],
    identifier?: string
  ): Promise<DecryptedToken | null> {
    return this.getToken(tenantId, provider, 'refresh_token', identifier);
  }

  /**
   * Mark a token as invalid (e.g., after failed API call).
   */
  async markTokenInvalid(tokenId: string, error: string): Promise<void> {
    await db
      .update(tokenVault)
      .set({
        isValid: 'false',
        lastError: error,
        updatedAt: new Date(),
      })
      .where(eq(tokenVault.id, tokenId));
  }

  /**
   * Delete a token.
   */
  async deleteToken(tokenId: string): Promise<void> {
    await db.delete(tokenVault).where(eq(tokenVault.id, tokenId));
  }

  /**
   * Delete all tokens for a tenant/provider.
   */
  async deleteProviderTokens(tenantId: string, provider: TokenVaultEntry['provider']): Promise<void> {
    await db
      .delete(tokenVault)
      .where(and(eq(tokenVault.tenantId, tenantId), eq(tokenVault.provider, provider)));
  }

  /**
   * Find tokens expiring within a time window (for proactive refresh job).
   */
  async findExpiringTokens(
    withinMinutes: number,
    provider?: TokenVaultEntry['provider']
  ): Promise<Array<{ tenantId: string; provider: string; tokenType: string; identifier: string | null }>> {
    const expiresBy = new Date(Date.now() + withinMinutes * 60 * 1000);

    const conditions = [
      eq(tokenVault.isValid, 'true'),
      eq(tokenVault.tokenType, 'access_token'),
      lt(tokenVault.expiresAt, expiresBy),
    ];

    if (provider) {
      conditions.push(eq(tokenVault.provider, provider));
    }

    const entries = await db.query.tokenVault.findMany({
      where: and(...conditions),
      columns: {
        tenantId: true,
        provider: true,
        tokenType: true,
        identifier: true,
      },
    });

    return entries;
  }
}

// Export singleton instance
export const tokenVaultService = new TokenVaultService();
