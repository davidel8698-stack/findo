import { db } from '../../db/index';
import { whatsappConnections, googleConnections, processedReviews } from '../../db/schema/index';
import { eq, and, lte } from 'drizzle-orm';

/**
 * Component health status.
 * Per CONTEXT.md: Component breakdown shows checkmark/warning for each service.
 */
export type ComponentStatus = 'ok' | 'warning' | 'error';

/**
 * Overall system health status (traffic light).
 * Per CONTEXT.md: "Traffic light (green/yellow/red)"
 */
export type OverallStatus = 'green' | 'yellow' | 'red';

/**
 * Health status for a single component.
 */
export interface HealthComponent {
  status: ComponentStatus;
  message?: string;
}

/**
 * Complete health status with traffic light and component breakdown.
 * Per CONTEXT.md: "Traffic light (green/yellow/red) PLUS component breakdown (WhatsApp checkmark, Google checkmark, Reviews warning)"
 */
export interface HealthStatus {
  overall: OverallStatus;
  components: {
    whatsapp: HealthComponent;
    google: HealthComponent;
    reviews: HealthComponent;
  };
}

/**
 * Hebrew messages for health component statuses.
 * Matches Israeli market focus per CONTEXT.md.
 */
const HEALTH_MESSAGES = {
  whatsapp: {
    ok: 'מחובר ופעיל',
    pending: 'ממתין לאימות',
    error: 'נדרש חיבור מחדש',
    noConnection: 'לא מחובר',
  },
  google: {
    ok: 'מחובר ופעיל',
    pending: 'ממתין לאימות',
    error: 'נדרש חיבור מחדש',
    noConnection: 'לא מחובר',
  },
  reviews: {
    ok: 'ביקורות מעודכנות',
    warning: 'יש ביקורות שממתינות לאישור',
  },
};

/**
 * Get health status for a tenant.
 *
 * Checks:
 * 1. WhatsApp connection status
 * 2. Google connection status
 * 3. Pending review approvals older than 24h
 *
 * @param tenantId - Tenant UUID
 * @returns Complete health status with traffic light and component breakdown
 */
export async function getHealthStatus(tenantId: string): Promise<HealthStatus> {
  // Run all health checks in parallel
  const [whatsappHealth, googleHealth, reviewsHealth] = await Promise.all([
    checkWhatsAppHealth(tenantId),
    checkGoogleHealth(tenantId),
    checkReviewsHealth(tenantId),
  ]);

  // Calculate overall status
  const overall = calculateOverallStatus(whatsappHealth, googleHealth, reviewsHealth);

  return {
    overall,
    components: {
      whatsapp: whatsappHealth,
      google: googleHealth,
      reviews: reviewsHealth,
    },
  };
}

/**
 * Check WhatsApp connection health for a tenant.
 */
async function checkWhatsAppHealth(tenantId: string): Promise<HealthComponent> {
  const connection = await db.query.whatsappConnections.findFirst({
    where: eq(whatsappConnections.tenantId, tenantId),
    columns: { status: true },
  });

  if (!connection) {
    return {
      status: 'error',
      message: HEALTH_MESSAGES.whatsapp.noConnection,
    };
  }

  switch (connection.status) {
    case 'active':
      return {
        status: 'ok',
        message: HEALTH_MESSAGES.whatsapp.ok,
      };

    case 'pending':
      return {
        status: 'warning',
        message: HEALTH_MESSAGES.whatsapp.pending,
      };

    case 'invalid':
    case 'disconnected':
      return {
        status: 'error',
        message: HEALTH_MESSAGES.whatsapp.error,
      };

    default:
      return {
        status: 'error',
        message: HEALTH_MESSAGES.whatsapp.error,
      };
  }
}

/**
 * Check Google connection health for a tenant.
 */
async function checkGoogleHealth(tenantId: string): Promise<HealthComponent> {
  const connection = await db.query.googleConnections.findFirst({
    where: eq(googleConnections.tenantId, tenantId),
    columns: { status: true },
  });

  if (!connection) {
    return {
      status: 'error',
      message: HEALTH_MESSAGES.google.noConnection,
    };
  }

  switch (connection.status) {
    case 'active':
      return {
        status: 'ok',
        message: HEALTH_MESSAGES.google.ok,
      };

    case 'pending':
      return {
        status: 'warning',
        message: HEALTH_MESSAGES.google.pending,
      };

    case 'invalid':
    case 'disconnected':
      return {
        status: 'error',
        message: HEALTH_MESSAGES.google.error,
      };

    default:
      return {
        status: 'error',
        message: HEALTH_MESSAGES.google.error,
      };
  }
}

/**
 * Check reviews health for a tenant.
 * Returns warning if there are pending_approval reviews older than 24h.
 */
async function checkReviewsHealth(tenantId: string): Promise<HealthComponent> {
  // Check for pending_approval reviews older than 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const pendingOldReviews = await db.query.processedReviews.findMany({
    where: and(
      eq(processedReviews.tenantId, tenantId),
      eq(processedReviews.status, 'pending_approval'),
      lte(processedReviews.approvalSentAt, twentyFourHoursAgo)
    ),
    columns: { id: true },
    limit: 1, // We only need to know if at least one exists
  });

  if (pendingOldReviews.length > 0) {
    return {
      status: 'warning',
      message: HEALTH_MESSAGES.reviews.warning,
    };
  }

  return {
    status: 'ok',
    message: HEALTH_MESSAGES.reviews.ok,
  };
}

/**
 * Calculate overall health status from component statuses.
 * Per CONTEXT.md: Traffic light logic
 * - 'red' if any component is 'error'
 * - 'yellow' if any component is 'warning'
 * - 'green' if all components are 'ok'
 */
function calculateOverallStatus(
  whatsapp: HealthComponent,
  google: HealthComponent,
  reviews: HealthComponent
): OverallStatus {
  const statuses = [whatsapp.status, google.status, reviews.status];

  if (statuses.includes('error')) {
    return 'red';
  }

  if (statuses.includes('warning')) {
    return 'yellow';
  }

  return 'green';
}
