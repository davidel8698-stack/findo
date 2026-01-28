import { IcountCredentials, IcountLoginResponse } from './types';

const ICOUNT_API = 'https://api.icount.co.il';

/**
 * iCount API client with session-based authentication.
 *
 * IMPORTANT: iCount uses session IDs (sid) that may not support concurrency.
 * Create a new client per polling cycle and avoid sharing sessions.
 * Per research pitfall #2: Use single session per polling cycle.
 */
export class IcountClient {
  private credentials: IcountCredentials;
  private sessionId: string | null = null;

  constructor(credentials: IcountCredentials) {
    this.credentials = credentials;
  }

  /**
   * Login to iCount and obtain session ID.
   * Session IDs typically expire after 1 hour.
   */
  async login(): Promise<string> {
    if (this.sessionId) {
      return this.sessionId;
    }

    const response = await fetch(`${ICOUNT_API}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        cid: this.credentials.companyId,
        user: this.credentials.username,
        pass: this.credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error(`iCount login failed: HTTP ${response.status}`);
    }

    const data = (await response.json()) as IcountLoginResponse;

    if (data.status !== 'ok' || !data.sid) {
      throw new Error(`iCount login failed: ${data.reason || 'Unknown error'}`);
    }

    this.sessionId = data.sid;
    return this.sessionId;
  }

  /**
   * Logout and invalidate session.
   * Call this after completing a polling cycle.
   */
  async logout(): Promise<void> {
    if (!this.sessionId) return;

    try {
      await fetch(`${ICOUNT_API}/api/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ sid: this.sessionId }),
      });
    } catch (error) {
      // Logout failures are non-critical, log and continue
      console.warn('[icount] Logout failed:', error);
    }

    this.sessionId = null;
  }

  /**
   * Make authenticated request to iCount API.
   * Requires login() to be called first.
   */
  async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.sessionId) {
      await this.login();
    }

    const response = await fetch(`${ICOUNT_API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        sid: this.sessionId!,
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error(`iCount API error: HTTP ${response.status}`);
    }

    const data = (await response.json()) as T & { status?: string; reason?: string };

    // iCount returns status field in responses
    if (data.status === 'error') {
      // Session may have expired
      if (data.reason?.includes('session') || data.reason?.includes('auth')) {
        this.sessionId = null;
        throw new Error(`iCount session expired: ${data.reason}`);
      }
      throw new Error(`iCount API error: ${data.reason}`);
    }

    return data as T;
  }
}

/**
 * Create iCount client for a polling cycle.
 * Credentials should be decrypted from token vault before calling.
 *
 * Usage pattern:
 * ```typescript
 * const client = createIcountClient(credentials);
 * try {
 *   await client.login();
 *   const invoices = await fetchInvoices(client, fromDate);
 *   // Process invoices...
 * } finally {
 *   await client.logout(); // Always logout after use
 * }
 * ```
 */
export function createIcountClient(credentials: IcountCredentials): IcountClient {
  return new IcountClient(credentials);
}

// Re-export types
export * from './types';
export * from './documents';
