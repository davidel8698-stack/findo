import { db } from '../../db/index';
import { whatsappConnections } from '../../db/schema/index';
import { tokenVaultService } from '../token-vault';
import { eq } from 'drizzle-orm';

interface EmbeddedSignupData {
  code: string;           // OAuth authorization code from FB.login
  wabaId: string;         // WhatsApp Business Account ID from sessionInfo
  phoneNumberId: string;  // Phone Number ID from sessionInfo
  displayPhoneNumber?: string; // Human-readable phone (optional)
  businessName?: string;  // Business name from Meta (optional)
}

interface EmbeddedSignupResult {
  success: boolean;
  connectionId?: string;
  error?: string;
  errorDetails?: unknown;
}

/**
 * Exchange auth code for access token with Meta Graph API.
 */
async function exchangeCodeForToken(code: string): Promise<string> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('META_APP_ID and META_APP_SECRET must be configured');
  }

  const url = new URL('https://graph.facebook.com/v21.0/oauth/access_token');
  url.searchParams.set('client_id', appId);
  url.searchParams.set('client_secret', appSecret);
  url.searchParams.set('code', code);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json() as { error?: { message?: string } };
    throw new Error(`Token exchange failed: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

/**
 * Process Embedded Signup completion.
 *
 * 1. Exchange auth code for access token
 * 2. Store access token in Token Vault (encrypted)
 * 3. Store Phone Number ID in Token Vault (for API calls)
 * 4. Create or update whatsapp_connections record
 */
export async function processEmbeddedSignup(
  tenantId: string,
  data: EmbeddedSignupData
): Promise<EmbeddedSignupResult> {
  try {
    // Step 1: Exchange code for access token
    const accessToken = await exchangeCodeForToken(data.code);

    // Step 2: Store access token in Token Vault
    // Using wabaId as identifier to support future multi-WABA scenarios
    await tokenVaultService.storeToken(
      tenantId,
      'whatsapp',
      'access_token',
      {
        value: accessToken,
        identifier: data.wabaId,
        // Embedded Signup tokens are short-lived initially
        // Consider: Exchange for long-lived token or guide to System User token
        // For now, store without expiry (will handle refresh separately)
      }
    );

    // Step 3: Store Phone Number ID (needed for API calls)
    await tokenVaultService.storeToken(
      tenantId,
      'whatsapp',
      'api_key', // Using api_key type for Phone Number ID
      {
        value: data.phoneNumberId,
        identifier: data.wabaId,
      }
    );

    // Step 4: Create or update connection record
    const existing = await db.query.whatsappConnections.findFirst({
      where: eq(whatsappConnections.tenantId, tenantId),
    });

    let connectionId: string;

    if (existing) {
      // Update existing connection (reconnection scenario)
      await db
        .update(whatsappConnections)
        .set({
          wabaId: data.wabaId,
          phoneNumberId: data.phoneNumberId,
          displayPhoneNumber: data.displayPhoneNumber || '',
          businessName: data.businessName,
          status: 'active',
          verifiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(whatsappConnections.id, existing.id));
      connectionId = existing.id;
    } else {
      // Create new connection
      const [inserted] = await db
        .insert(whatsappConnections)
        .values({
          tenantId,
          wabaId: data.wabaId,
          phoneNumberId: data.phoneNumberId,
          displayPhoneNumber: data.displayPhoneNumber || '',
          businessName: data.businessName,
          status: 'active',
          verifiedAt: new Date(),
        })
        .returning({ id: whatsappConnections.id });
      connectionId = inserted.id;
    }

    console.log(`[whatsapp] Embedded Signup completed for tenant ${tenantId}, connection ${connectionId}`);

    return {
      success: true,
      connectionId,
    };
  } catch (error) {
    console.error('[whatsapp] Embedded Signup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetails: error,
    };
  }
}

/**
 * Get connection status for a tenant.
 */
export async function getConnectionStatus(tenantId: string) {
  const connection = await db.query.whatsappConnections.findFirst({
    where: eq(whatsappConnections.tenantId, tenantId),
  });

  if (!connection) {
    return { connected: false };
  }

  return {
    connected: connection.status === 'active',
    status: connection.status,
    phoneNumber: connection.displayPhoneNumber,
    businessName: connection.businessName,
    connectedAt: connection.verifiedAt,
  };
}

/**
 * Disconnect WhatsApp (marks as disconnected, doesn't delete data).
 */
export async function disconnectWhatsApp(tenantId: string): Promise<boolean> {
  await db
    .update(whatsappConnections)
    .set({
      status: 'disconnected',
      updatedAt: new Date(),
    })
    .where(eq(whatsappConnections.tenantId, tenantId));

  // Delete tokens
  await tokenVaultService.deleteProviderTokens(tenantId, 'whatsapp');

  return true;
}
