import { tokenVaultService } from '../token-vault';

/**
 * WhatsApp Graph API client configuration.
 */
export interface WhatsAppClientConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion?: string; // Default: 'v21.0'
}

/**
 * WhatsApp API error with Meta-specific error codes.
 */
export class WhatsAppAPIError extends Error {
  constructor(
    message: string,
    public code?: number,
    public httpStatus?: number
  ) {
    super(message);
    this.name = 'WhatsAppAPIError';
  }
}

/**
 * WhatsApp Graph API client wrapper.
 *
 * Handles authenticated requests to Meta's Graph API for WhatsApp Business.
 * Uses the Cloud API (not On-Premises) as recommended by Meta.
 *
 * @example
 * ```typescript
 * const client = new WhatsAppClient({
 *   phoneNumberId: '123456789',
 *   accessToken: 'EAAG...',
 * });
 *
 * const response = await client.request('/123456789/messages', {
 *   method: 'POST',
 *   body: JSON.stringify({ messaging_product: 'whatsapp', ... }),
 * });
 * ```
 */
export class WhatsAppClient {
  private baseUrl: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor(config: WhatsAppClientConfig) {
    const version = config.apiVersion || 'v21.0';
    this.baseUrl = `https://graph.facebook.com/${version}`;
    this.accessToken = config.accessToken;
    this.phoneNumberId = config.phoneNumberId;
  }

  /**
   * Make an authenticated request to the Graph API.
   *
   * @param endpoint - API endpoint (e.g., '/123/messages')
   * @param options - Fetch options (method, body, headers)
   * @returns Parsed JSON response
   * @throws WhatsAppAPIError on API errors
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Unknown API error';
      let errorCode: number | undefined;

      try {
        const error = await response.json() as {
          error?: { message?: string; code?: number };
        };
        errorMessage = error.error?.message || errorMessage;
        errorCode = error.error?.code;
      } catch {
        // Response body not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new WhatsAppAPIError(errorMessage, errorCode, response.status);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get the messages endpoint for this phone number.
   * Used for sending messages via POST.
   */
  get messagesEndpoint(): string {
    return `/${this.phoneNumberId}/messages`;
  }

  /**
   * Get the phone number ID this client is configured for.
   */
  get phoneNumber(): string {
    return this.phoneNumberId;
  }
}

/**
 * Create a WhatsApp client from Token Vault credentials.
 *
 * Retrieves the access token and phone number ID from the Token Vault
 * for the specified tenant.
 *
 * @param tenantId - Tenant UUID
 * @returns WhatsAppClient if credentials exist, null otherwise
 *
 * @example
 * ```typescript
 * const client = await createWhatsAppClient('tenant-uuid');
 * if (client) {
 *   await sendTextMessage(client, '972501234567', 'Hello!');
 * }
 * ```
 */
export async function createWhatsAppClient(
  tenantId: string
): Promise<WhatsAppClient | null> {
  // Get access token from Token Vault
  const tokenResult = await tokenVaultService.getAccessToken(
    tenantId,
    'whatsapp'
  );

  if (!tokenResult) {
    return null;
  }

  // Get phone number ID (stored as api_key type)
  // Phone Number ID is stored as api_key because it's a static identifier, not a token
  const phoneNumberToken = await tokenVaultService.getToken(
    tenantId,
    'whatsapp',
    'api_key'
  );

  if (!phoneNumberToken) {
    return null;
  }

  return new WhatsAppClient({
    phoneNumberId: phoneNumberToken.value,
    accessToken: tokenResult.token.value,
  });
}
