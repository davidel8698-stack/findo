import { GreeninvoiceCredentials, GreeninvoiceTokenResponse } from './types';

const GREENINVOICE_API = 'https://api.greeninvoice.co.il/api/v1';

// Token cache: tenantId -> { token, expiresAt }
const tokenCache = new Map<string, { token: string; expiresAt: Date }>();

/**
 * Greeninvoice API client with automatic JWT token management.
 */
export class GreeninvoiceClient {
  private tenantId: string;
  private credentials: GreeninvoiceCredentials;

  constructor(tenantId: string, credentials: GreeninvoiceCredentials) {
    this.tenantId = tenantId;
    this.credentials = credentials;
  }

  /**
   * Get a valid JWT token, refreshing if expired or about to expire.
   * Tokens are cached per tenant. Refreshes 5 minutes before expiration.
   */
  async getToken(): Promise<string> {
    const cached = tokenCache.get(this.tenantId);

    // Check if token is valid (with 5 minute buffer)
    if (cached) {
      const bufferMs = 5 * 60 * 1000; // 5 minutes
      if (new Date(Date.now() + bufferMs) < cached.expiresAt) {
        return cached.token;
      }
    }

    // Fetch new token
    const response = await fetch(`${GREENINVOICE_API}/account/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.credentials.id,
        secret: this.credentials.secret,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Greeninvoice auth failed: ${response.status} ${text}`);
    }

    const data = (await response.json()) as GreeninvoiceTokenResponse;

    // Cache token with expiration
    const expiresAt = new Date(Date.now() + data.expiresIn * 1000);
    tokenCache.set(this.tenantId, { token: data.token, expiresAt });

    return data.token;
  }

  /**
   * Make authenticated request to Greeninvoice API.
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();

    const response = await fetch(`${GREENINVOICE_API}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // If 401, clear cache and retry once
      if (response.status === 401) {
        tokenCache.delete(this.tenantId);
        const retryToken = await this.getToken();
        const retryResponse = await fetch(`${GREENINVOICE_API}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${retryToken}`,
            ...options.headers,
          },
        });
        if (!retryResponse.ok) {
          throw new Error(`Greeninvoice API error: ${retryResponse.status}`);
        }
        return (await retryResponse.json()) as T;
      }
      throw new Error(`Greeninvoice API error: ${response.status}`);
    }

    return (await response.json()) as T;
  }
}

/**
 * Create Greeninvoice client for a tenant.
 * Credentials should be decrypted from token vault before calling.
 */
export function createGreeninvoiceClient(
  tenantId: string,
  credentials: GreeninvoiceCredentials
): GreeninvoiceClient {
  return new GreeninvoiceClient(tenantId, credentials);
}

// Re-export types
export * from './types';
