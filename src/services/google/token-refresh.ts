import { google } from 'googleapis';
import { db } from '../../db/index';
import { googleConnections } from '../../db/schema/index';
import { tokenVaultService } from '../token-vault';
import { activityService } from '../activity';
import { eq } from 'drizzle-orm';

/**
 * Refresh Google tokens that are expiring soon.
 *
 * Called by scheduled job every 5 minutes.
 * Finds tokens expiring within 10 minutes and proactively refreshes them.
 *
 * @returns Summary of refresh operation
 */
export async function refreshExpiringGoogleTokens(): Promise<{
  checked: number;
  refreshed: number;
  failed: number;
}> {
  console.log('[google-token-refresh] Starting proactive token refresh');

  // Find Google access tokens expiring within 10 minutes
  const expiring = await tokenVaultService.findExpiringTokens(10, 'google');

  const results = {
    checked: expiring.length,
    refreshed: 0,
    failed: 0,
  };

  for (const entry of expiring) {
    try {
      await refreshTokenForTenant(entry.tenantId, entry.identifier || entry.tenantId);
      results.refreshed++;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[google-token-refresh] Failed for tenant ${entry.tenantId}:`, errorMessage);
      results.failed++;
    }

    // Small delay between refreshes to avoid rate limiting (100ms)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(
    `[google-token-refresh] Complete: ${results.checked} checked, ${results.refreshed} refreshed, ${results.failed} failed`
  );

  return results;
}

/**
 * Refresh token for a specific tenant.
 *
 * @param tenantId - Tenant UUID
 * @param identifier - Token identifier (accountId or tenantId)
 */
async function refreshTokenForTenant(tenantId: string, identifier: string): Promise<void> {
  // Get refresh token from vault
  const refreshToken = await tokenVaultService.getRefreshToken(tenantId, 'google', identifier);

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  // Create OAuth client and set refresh token
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken.value,
  });

  // Force refresh the access token
  const { credentials } = await oauth2Client.refreshAccessToken();

  if (!credentials.access_token) {
    throw new Error('No access token received from refresh');
  }

  // Store new access token
  await tokenVaultService.storeToken(tenantId, 'google', 'access_token', {
    value: credentials.access_token,
    expiresAt: credentials.expiry_date
      ? new Date(credentials.expiry_date)
      : new Date(Date.now() + 3600000), // Default 1 hour if not provided
    identifier,
  });

  // If we got a new refresh token (rare, but Google may rotate), store it too
  if (credentials.refresh_token) {
    await tokenVaultService.storeToken(tenantId, 'google', 'refresh_token', {
      value: credentials.refresh_token,
      identifier,
    });
  }

  console.log(`[google-token-refresh] Refreshed token for tenant ${tenantId}`);
}

/**
 * Validate a Google token by calling the accounts.list endpoint.
 *
 * Used by daily validation job to detect revoked/invalid tokens.
 *
 * @param tenantId - Tenant UUID
 * @param identifier - Token identifier (accountId or tenantId)
 * @returns true if token is valid, false if invalid
 */
export async function validateGoogleToken(tenantId: string, identifier: string): Promise<boolean> {
  try {
    const accessTokenResult = await tokenVaultService.getAccessToken(tenantId, 'google', identifier, 0);

    if (!accessTokenResult) {
      console.warn(`[google-validation] No access token for tenant ${tenantId}`);
      return false;
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessTokenResult.token.value });

    // Try to list accounts as validation check (low cost)
    const mybusinessaccountmanagement = google.mybusinessaccountmanagement({
      version: 'v1',
      auth: oauth2Client,
    });

    await mybusinessaccountmanagement.accounts.list();

    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[google-validation] Token validation failed for tenant ${tenantId}:`, errorMessage);

    // Mark token as invalid
    const accessToken = await tokenVaultService.getToken(tenantId, 'google', 'access_token', identifier);
    if (accessToken) {
      await tokenVaultService.markTokenInvalid(accessToken.id, `Validation failed: ${errorMessage}`);
    }

    // Update connection status to invalid
    await db
      .update(googleConnections)
      .set({ status: 'invalid', updatedAt: new Date() })
      .where(eq(googleConnections.tenantId, tenantId));

    // Create activity event for dashboard notification
    await activityService.createAndPublish(tenantId, {
      eventType: 'google.token.invalid',
      title: 'Google connection lost',
      description: `Google token is no longer valid: ${errorMessage}. Please reconnect.`,
      source: 'system',
      metadata: {
        error: errorMessage,
        action: 'reconnect_required',
      },
    });

    return false;
  }
}

/**
 * Validate all active Google connections.
 *
 * Called by daily scheduled job (3:30 AM Israel time).
 * Checks each active connection and marks invalid ones.
 *
 * Processing:
 * - Sequential to avoid rate limiting
 * - 100ms delay between checks
 * - Uses accounts.list endpoint (low cost)
 *
 * @returns Summary of validation results
 */
export async function validateAllGoogleTokens(): Promise<{
  checked: number;
  valid: number;
  invalid: number;
  errors: Array<{ tenantId: string; error: string }>;
}> {
  console.log('[google-validation] Starting daily token validation');

  // Get all active Google connections
  const connections = await db.query.googleConnections.findMany({
    where: eq(googleConnections.status, 'active'),
    columns: {
      tenantId: true,
      accountId: true,
    },
  });

  const results = {
    checked: connections.length,
    valid: 0,
    invalid: 0,
    errors: [] as Array<{ tenantId: string; error: string }>,
  };

  for (const conn of connections) {
    // Use tenantId as identifier (matching oauth.ts pattern)
    const isValid = await validateGoogleToken(conn.tenantId, conn.tenantId);

    if (isValid) {
      results.valid++;
    } else {
      results.invalid++;
      results.errors.push({
        tenantId: conn.tenantId,
        error: 'Validation failed',
      });
    }

    // Rate limit protection (100ms between checks)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(
    `[google-validation] Complete: ${results.valid}/${results.checked} valid, ${results.invalid} invalid`
  );

  return results;
}
