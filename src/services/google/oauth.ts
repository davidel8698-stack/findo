import { google, Auth } from 'googleapis';
import { db } from '../../db/index';
import { googleConnections } from '../../db/schema/index';
import { tokenVaultService } from '../token-vault';
import { eq } from 'drizzle-orm';

// Type alias for OAuth2 client (avoids pnpm path leakage in types)
type OAuth2Client = Auth.OAuth2Client;

// Google Business Profile API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/business.manage', // Read/write business info
];

// State parameter format: tenantId (UUID)
// Validates that callback is for correct tenant

/**
 * Create OAuth2 client with configured credentials.
 */
function createOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI must be configured');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generate authorization URL for initiating OAuth flow.
 *
 * @param tenantId - Tenant UUID to embed in state parameter
 * @returns Authorization URL to redirect user to
 */
export function getAuthUrl(tenantId: string): string {
  const oauth2Client = createOAuthClient();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Request refresh token
    scope: SCOPES,
    state: tenantId, // Pass tenant ID in state for callback validation
    prompt: 'consent', // Force consent screen to ensure refresh token
    include_granted_scopes: true,
  });

  return authUrl;
}

interface CallbackResult {
  success: boolean;
  connectionId?: string;
  error?: string;
  errorDetails?: unknown;
}

/**
 * Handle OAuth callback: exchange code for tokens and store credentials.
 *
 * @param code - Authorization code from Google
 * @param state - State parameter (tenant ID)
 * @returns Result with connection ID or error
 */
export async function handleCallback(
  code: string,
  state: string
): Promise<CallbackResult> {
  try {
    const tenantId = state;

    // Validate tenant exists
    const tenantExists = await db.query.tenants?.findFirst({
      where: (tenants, { eq }) => eq(tenants.id, tenantId),
    });
    if (!tenantExists) {
      return { success: false, error: 'Invalid tenant' };
    }

    // Exchange code for tokens
    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return { success: false, error: 'No access token received' };
    }

    // Set credentials for API calls
    oauth2Client.setCredentials(tokens);

    // Listen for token refresh events (for future auto-refresh handling)
    oauth2Client.on('tokens', async (newTokens) => {
      console.log(`[google] Tokens refreshed for tenant ${tenantId}`);
      // Store updated access token
      if (newTokens.access_token) {
        await tokenVaultService.storeToken(
          tenantId,
          'google',
          'access_token',
          {
            value: newTokens.access_token,
            identifier: tenantId,
            expiresAt: newTokens.expiry_date ? new Date(newTokens.expiry_date) : undefined,
          }
        );
      }
    });

    // Fetch GBP accounts to get account ID and name
    const mybusinessaccountmanagement = google.mybusinessaccountmanagement({ version: 'v1', auth: oauth2Client });

    let accountId = '';
    let accountName = '';

    try {
      const accountsResponse = await mybusinessaccountmanagement.accounts.list();
      const accounts = accountsResponse.data.accounts || [];

      if (accounts.length === 0) {
        return { success: false, error: 'No Google Business Profile accounts found' };
      }

      // Use first account (most businesses have one)
      const account = accounts[0];
      // Account name format: accounts/{accountId}
      accountId = account.name?.replace('accounts/', '') || '';
      accountName = account.accountName || account.name || '';
    } catch (apiError) {
      console.error('[google] Failed to fetch accounts:', apiError);
      return {
        success: false,
        error: 'Failed to fetch Google Business Profile accounts',
        errorDetails: apiError,
      };
    }

    // Store access token
    await tokenVaultService.storeToken(
      tenantId,
      'google',
      'access_token',
      {
        value: tokens.access_token,
        identifier: tenantId,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      }
    );

    // Store refresh token (if provided)
    if (tokens.refresh_token) {
      await tokenVaultService.storeToken(
        tenantId,
        'google',
        'refresh_token',
        {
          value: tokens.refresh_token,
          identifier: tenantId,
          // Refresh tokens don't expire (unless revoked)
        }
      );
    }

    // Create or update connection record
    const existing = await db.query.googleConnections.findFirst({
      where: eq(googleConnections.tenantId, tenantId),
    });

    let connectionId: string;

    if (existing) {
      // Update existing connection (reconnection scenario)
      await db
        .update(googleConnections)
        .set({
          accountId,
          accountName,
          status: 'active',
          verifiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(googleConnections.id, existing.id));
      connectionId = existing.id;
    } else {
      // Create new connection
      const [inserted] = await db
        .insert(googleConnections)
        .values({
          tenantId,
          accountId,
          accountName,
          status: 'active',
          verifiedAt: new Date(),
        })
        .returning({ id: googleConnections.id });
      connectionId = inserted.id;
    }

    console.log(`[google] OAuth completed for tenant ${tenantId}, account ${accountId}`);

    return {
      success: true,
      connectionId,
    };
  } catch (error) {
    console.error('[google] OAuth callback failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetails: error,
    };
  }
}

/**
 * Get Google connection status for a tenant.
 */
export async function getGoogleConnection(tenantId: string) {
  const connection = await db.query.googleConnections.findFirst({
    where: eq(googleConnections.tenantId, tenantId),
  });

  if (!connection) {
    return { connected: false };
  }

  return {
    connected: connection.status === 'active',
    status: connection.status,
    accountId: connection.accountId,
    accountName: connection.accountName,
    locationId: connection.locationId,
    locationName: connection.locationName,
    connectedAt: connection.verifiedAt,
  };
}

/**
 * Disconnect Google (marks as disconnected, deletes tokens).
 */
export async function disconnectGoogle(tenantId: string): Promise<boolean> {
  await db
    .update(googleConnections)
    .set({
      status: 'disconnected',
      updatedAt: new Date(),
    })
    .where(eq(googleConnections.tenantId, tenantId));

  // Delete tokens
  await tokenVaultService.deleteProviderTokens(tenantId, 'google');

  console.log(`[google] Disconnected for tenant ${tenantId}`);

  return true;
}

/**
 * Create an authenticated OAuth2 client for a tenant.
 * Use this for making Google API calls.
 *
 * @param tenantId - Tenant UUID
 * @returns Authenticated OAuth2 client or null if no valid tokens
 */
export async function createAuthenticatedClient(tenantId: string): Promise<OAuth2Client | null> {
  // Get access token
  const accessTokenResult = await tokenVaultService.getAccessToken(tenantId, 'google', tenantId);

  if (!accessTokenResult) {
    // Try to refresh with refresh token
    const refreshToken = await tokenVaultService.getRefreshToken(tenantId, 'google', tenantId);

    if (!refreshToken) {
      console.warn(`[google] No valid tokens for tenant ${tenantId}`);
      return null;
    }

    // Create client with refresh token to get new access token
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({
      refresh_token: refreshToken.value,
    });

    // Force token refresh
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();

      if (credentials.access_token) {
        // Store the new access token
        await tokenVaultService.storeToken(
          tenantId,
          'google',
          'access_token',
          {
            value: credentials.access_token,
            identifier: tenantId,
            expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined,
          }
        );
      }

      return oauth2Client;
    } catch (error) {
      console.error(`[google] Token refresh failed for tenant ${tenantId}:`, error);

      // Mark connection as invalid
      await db
        .update(googleConnections)
        .set({
          status: 'invalid',
          updatedAt: new Date(),
        })
        .where(eq(googleConnections.tenantId, tenantId));

      return null;
    }
  }

  // Create client with existing access token
  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials({
    access_token: accessTokenResult.token.value,
    expiry_date: accessTokenResult.token.expiresAt?.getTime(),
  });

  // Get refresh token to enable auto-refresh
  const refreshToken = await tokenVaultService.getRefreshToken(tenantId, 'google', tenantId);
  if (refreshToken) {
    oauth2Client.setCredentials({
      ...oauth2Client.credentials,
      refresh_token: refreshToken.value,
    });
  }

  // Listen for token refresh events
  oauth2Client.on('tokens', async (newTokens) => {
    console.log(`[google] Tokens refreshed for tenant ${tenantId}`);
    if (newTokens.access_token) {
      await tokenVaultService.storeToken(
        tenantId,
        'google',
        'access_token',
        {
          value: newTokens.access_token,
          identifier: tenantId,
          expiresAt: newTokens.expiry_date ? new Date(newTokens.expiry_date) : undefined,
        }
      );
    }
  });

  // If token needs refresh soon, proactively refresh
  if (accessTokenResult.needsRefresh && refreshToken) {
    try {
      await oauth2Client.refreshAccessToken();
    } catch (error) {
      console.warn(`[google] Proactive refresh failed for tenant ${tenantId}:`, error);
      // Continue with existing token, it's still valid
    }
  }

  return oauth2Client;
}
