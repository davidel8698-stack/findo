import { db } from '../db/index';
import { activityEvents, type ActivityEvent, type NewActivityEvent } from '../db/schema/index';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { activityQueue, type ActivityJobData } from '../queue/index';

export interface ActivityFeedOptions {
  limit?: number;
  offset?: number;
  eventType?: string;
  since?: Date;
  until?: Date;
}

/**
 * ActivityService handles activity feed operations.
 * Creates activity events and provides query interface for dashboard feed.
 */
export class ActivityService {
  /**
   * Create an activity event and optionally publish to real-time feed.
   */
  async createEvent(
    tenantId: string,
    event: Omit<NewActivityEvent, 'tenantId'>
  ): Promise<ActivityEvent> {
    const [created] = await db
      .insert(activityEvents)
      .values({
        ...event,
        tenantId,
      })
      .returning();

    return created;
  }

  /**
   * Create event and publish to activity queue for real-time updates.
   */
  async createAndPublish(
    tenantId: string,
    event: Omit<NewActivityEvent, 'tenantId'>
  ): Promise<ActivityEvent> {
    // Create in database
    const created = await this.createEvent(tenantId, event);

    // Publish to activity queue for real-time feed
    await activityQueue.add('publish', {
      tenantId,
      eventType: event.eventType,
      title: event.title,
      description: event.description ?? undefined,
      metadata: event.metadata ?? undefined,
      source: event.source,
      sourceId: event.sourceId ?? undefined,
    } satisfies ActivityJobData);

    return created;
  }

  /**
   * Get activity feed for a tenant.
   * Results are ordered by occurredAt DESC (newest first).
   */
  async getFeed(
    tenantId: string,
    options: ActivityFeedOptions = {}
  ): Promise<ActivityEvent[]> {
    const {
      limit = 50,
      offset = 0,
      eventType,
      since,
      until,
    } = options;

    const conditions = [eq(activityEvents.tenantId, tenantId)];

    if (eventType) {
      conditions.push(eq(activityEvents.eventType, eventType));
    }

    if (since) {
      conditions.push(gte(activityEvents.occurredAt, since));
    }

    if (until) {
      conditions.push(lte(activityEvents.occurredAt, until));
    }

    const events = await db.query.activityEvents.findMany({
      where: and(...conditions),
      orderBy: [desc(activityEvents.occurredAt)],
      limit,
      offset,
    });

    return events;
  }

  /**
   * Get recent activity (last N events).
   */
  async getRecent(tenantId: string, count: number = 10): Promise<ActivityEvent[]> {
    return this.getFeed(tenantId, { limit: count });
  }

  /**
   * Get activity since a specific event (for polling updates).
   */
  async getSince(tenantId: string, sinceEventId: string): Promise<ActivityEvent[]> {
    // Get the timestamp of the reference event
    const referenceEvent = await db.query.activityEvents.findFirst({
      where: and(
        eq(activityEvents.tenantId, tenantId),
        eq(activityEvents.id, sinceEventId)
      ),
      columns: { occurredAt: true },
    });

    if (!referenceEvent) {
      // If reference event not found, return recent events
      return this.getRecent(tenantId, 20);
    }

    // Get events newer than the reference
    return db.query.activityEvents.findMany({
      where: and(
        eq(activityEvents.tenantId, tenantId),
        gte(activityEvents.occurredAt, referenceEvent.occurredAt)
      ),
      orderBy: [desc(activityEvents.occurredAt)],
      limit: 100,
    });
  }

  /**
   * Count events by type (for dashboard stats).
   */
  async countByType(
    tenantId: string,
    eventType: string,
    since?: Date
  ): Promise<number> {
    const conditions = [
      eq(activityEvents.tenantId, tenantId),
      eq(activityEvents.eventType, eventType),
    ];

    if (since) {
      conditions.push(gte(activityEvents.occurredAt, since));
    }

    const events = await db.query.activityEvents.findMany({
      where: and(...conditions),
      columns: { id: true },
    });

    return events.length;
  }
}

// Export singleton instance
export const activityService = new ActivityService();
