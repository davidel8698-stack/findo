import { db } from '../../db/index';
import { whatsappConnections } from '../../db/schema/index';
import { tokenVaultService } from '../token-vault';
import { activityService } from '../activity';
import { eq, ne } from 'drizzle-orm';

interface ValidationResult {
  tenantId: string;
  valid: boolean;
  error?: string;
}

/**
 * Validate a WhatsApp token by making a lightweight API call.
 *
 * Uses the "me" endpoint which returns account info if token is valid.
 * This is a low-cost way to verify token without consuming quota.
 */
async function validateToken(accessToken: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(
      'https://graph.facebook.com/v21.0/me',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      return { valid: true };
    }

    const error = await response.json() as { error?: { message?: string } };
    return {
      valid: false,
      error: error.error?.message || `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Validate a single tenant's WhatsApp token.
 *
 * On invalid token:
 * - Marks token invalid in Token Vault
 * - Updates connection status to 'invalid'
 * - Creates activity event for dashboard notification
 */
export async function validateTenantToken(tenantId: string): Promise<ValidationResult> {
  // Get the access token from vault
  const tokenResult = await tokenVaultService.getAccessToken(tenantId, 'whatsapp');

  if (!tokenResult) {
    return {
      tenantId,
      valid: false,
      error: 'No token found',
    };
  }

  // Validate the token
  const validation = await validateToken(tokenResult.token.value);

  if (!validation.valid) {
    // Mark token as invalid
    await tokenVaultService.markTokenInvalid(
      tokenResult.token.id,
      validation.error || 'Validation failed'
    );

    // Update connection status
    await db
      .update(whatsappConnections)
      .set({
        status: 'invalid',
        updatedAt: new Date(),
      })
      .where(eq(whatsappConnections.tenantId, tenantId));

    // Create activity event for dashboard notification
    // Per CONTEXT.md: Multi-channel notification (WhatsApp alert to owner + dashboard alert + email)
    // Since WhatsApp is broken, this uses dashboard activity. Email notification added in Phase 9.
    await activityService.createAndPublish(tenantId, {
      eventType: 'whatsapp.token.invalid',
      title: 'WhatsApp connection lost',
      description: `WhatsApp token is no longer valid: ${validation.error}. Please reconnect.`,
      source: 'system',
      metadata: {
        error: validation.error,
        action: 'reconnect_required',
      },
    });

    console.warn(
      `[whatsapp-validation] Token invalid for tenant ${tenantId}: ${validation.error}`
    );
  }

  return {
    tenantId,
    valid: validation.valid,
    error: validation.error,
  };
}

/**
 * Validate all active WhatsApp connections.
 *
 * Called by daily scheduled job (3:00 AM Israel time).
 * Returns summary of validation results.
 *
 * Processing:
 * - Sequential to avoid rate limiting
 * - 100ms delay between checks
 * - Uses Graph API /me endpoint (low cost)
 */
export async function validateWhatsAppTokens(): Promise<{
  total: number;
  valid: number;
  invalid: number;
  errors: Array<{ tenantId: string; error: string }>;
}> {
  console.log('[whatsapp-validation] Starting daily token validation');

  // Get all connections that are not disconnected
  // Validates: pending, active, and invalid (in case they became valid again)
  const connections = await db.query.whatsappConnections.findMany({
    where: ne(whatsappConnections.status, 'disconnected'),
    columns: {
      tenantId: true,
    },
  });

  const results = {
    total: connections.length,
    valid: 0,
    invalid: 0,
    errors: [] as Array<{ tenantId: string; error: string }>,
  };

  // Validate each tenant's token sequentially to avoid rate limiting
  for (const connection of connections) {
    const result = await validateTenantToken(connection.tenantId);

    if (result.valid) {
      results.valid++;
    } else {
      results.invalid++;
      results.errors.push({
        tenantId: connection.tenantId,
        error: result.error || 'Unknown error',
      });
    }

    // Small delay to avoid rate limiting (100ms between checks)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(
    `[whatsapp-validation] Complete: ${results.valid}/${results.total} valid, ${results.invalid} invalid`
  );

  return results;
}

/**
 * Schedule notification to owner when token is invalid.
 *
 * Per CONTEXT.md: Multi-channel notification (WhatsApp, dashboard, email).
 * Since WhatsApp is broken, this uses dashboard activity + email (Phase 9).
 *
 * For now, just creates activity event. Email notification added in Phase 9.
 */
export async function notifyTokenInvalid(tenantId: string, error: string): Promise<void> {
  // Activity event already created in validateTenantToken
  // This function is a placeholder for future email notification

  // TODO (Phase 9): Send email notification
  // TODO (Phase 9): If another WhatsApp number available, send alert there

  console.log(`[whatsapp-validation] Owner notification queued for tenant ${tenantId}`);
}
