/**
 * Activity Grouper Service
 *
 * Groups activity events into smart journeys for the activity feed.
 * Per CONTEXT.md: "Smart grouping - Group related events (e.g., 'Lead journey: call -> message -> qualified')"
 *
 * Events with the same sourceId are grouped into journey groups.
 * Single events become single items.
 */

import type { ActivityEvent } from '../../db/schema/index';

/**
 * Activity group representing either a journey (multiple related events)
 * or a single event.
 *
 * Per RESEARCH.md ActivityGroup interface pattern.
 */
export interface ActivityGroup {
  type: 'journey' | 'single';
  journeyType?: 'lead' | 'review' | 'content';
  sourceId: string;
  events: ActivityEvent[];
  summary: string;       // Hebrew summary
  expandedByDefault: boolean;
  latestAt: Date;        // For sorting groups
}

/**
 * Filter type for activity feed.
 * Per CONTEXT.md: "Type filters available - Tabs: Reviews / Leads / Content / All"
 */
export type ActivityFilter = 'all' | 'leads' | 'reviews' | 'content';

/**
 * Detect journey type from event type prefix.
 *
 * @param eventType - The event type string (e.g., 'lead.created', 'review.detected')
 * @returns Journey type or undefined for system events
 */
function detectJourneyType(eventType: string): 'lead' | 'review' | 'content' | undefined {
  if (eventType.startsWith('lead.')) return 'lead';
  if (eventType.startsWith('review.')) return 'review';
  if (eventType.startsWith('content.') || eventType.startsWith('photo.') || eventType.startsWith('post.')) return 'content';
  return undefined;
}

/**
 * Extract customer name from event metadata or title.
 *
 * @param events - Events in the group
 * @returns Customer name or phone fragment
 */
function extractCustomerName(events: ActivityEvent[]): string {
  for (const event of events) {
    const metadata = event.metadata as Record<string, unknown> | null;
    if (metadata) {
      if (typeof metadata.customerName === 'string' && metadata.customerName) {
        return metadata.customerName;
      }
      if (typeof metadata.phone === 'string' && metadata.phone) {
        // Return last 4 digits
        const phone = metadata.phone;
        return phone.slice(-4) + '...';
      }
    }
  }
  return 'לקוח';
}

/**
 * Extract review info from events.
 *
 * @param events - Events in the group
 * @returns Object with starRating and reviewerName
 */
function extractReviewInfo(events: ActivityEvent[]): { starRating: number | null; reviewerName: string } {
  let starRating: number | null = null;
  let reviewerName = 'לקוח';

  for (const event of events) {
    const metadata = event.metadata as Record<string, unknown> | null;
    if (metadata) {
      if (typeof metadata.starRating === 'number') {
        starRating = metadata.starRating;
      }
      if (typeof metadata.reviewerName === 'string' && metadata.reviewerName) {
        reviewerName = metadata.reviewerName;
      }
    }
  }

  return { starRating, reviewerName };
}

/**
 * Extract latest lead status from events.
 *
 * @param events - Events in the group
 * @returns Hebrew status string
 */
function extractLeadStatus(events: ActivityEvent[]): string {
  // Look for most recent status-related event
  const statusMap: Record<string, string> = {
    'lead.created': 'חדש',
    'lead.qualifying': 'בתהליך',
    'lead.qualified': 'הוסמך',
    'lead.converted': 'הומר',
    'lead.unresponsive': 'לא מגיב',
    'lead.lost': 'אבוד',
    'lead.reminder_sent': 'ממתין',
    'lead.message_sent': 'נשלח',
    'lead.message_received': 'ממתין',
  };

  // Find latest event with status
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (statusMap[event.eventType]) {
      return statusMap[event.eventType];
    }
  }

  return 'בטיפול';
}

/**
 * Generate Hebrew summary for an activity group.
 *
 * Per CONTEXT.md: Shows meaningful summary text.
 *
 * @param events - Events in the group
 * @param journeyType - Type of journey
 * @returns Hebrew summary string
 */
function generateSummary(events: ActivityEvent[], journeyType?: 'lead' | 'review' | 'content'): string {
  if (events.length === 1) {
    // Single event - use title directly
    return events[0].title;
  }

  switch (journeyType) {
    case 'lead': {
      const customerName = extractCustomerName(events);
      const status = extractLeadStatus(events);
      return `ליד: ${customerName} - ${status}`;
    }

    case 'review': {
      const { starRating, reviewerName } = extractReviewInfo(events);
      if (starRating !== null) {
        return `ביקורת: ${starRating} כוכבים מ${reviewerName}`;
      }
      return `ביקורת מ${reviewerName}`;
    }

    case 'content': {
      // Look for description in metadata
      for (const event of events) {
        const metadata = event.metadata as Record<string, unknown> | null;
        if (metadata && typeof metadata.description === 'string') {
          return `תוכן: ${metadata.description}`;
        }
      }
      return `תוכן: ${events.length} פעולות`;
    }

    default:
      // System or unknown - use first event title
      return events[0].title;
  }
}

/**
 * Group activity events by sourceId into smart groups.
 *
 * Per CONTEXT.md: "Smart grouping - Group related events"
 * Events with same sourceId become a journey group.
 * Events without sourceId or unique sourceId become single items.
 *
 * @param events - Array of activity events
 * @returns Array of activity groups sorted by latestAt DESC (newest first)
 */
export function groupActivityEvents(events: ActivityEvent[]): ActivityGroup[] {
  const groupsMap = new Map<string, ActivityEvent[]>();

  for (const event of events) {
    // Use sourceId for grouping, or event.id for single items
    const key = event.sourceId || event.id;
    const existing = groupsMap.get(key) || [];
    existing.push(event);
    groupsMap.set(key, existing);
  }

  const groups: ActivityGroup[] = [];

  for (const [sourceId, groupEvents] of groupsMap) {
    // Sort events within group by occurredAt ASC (oldest first within journey)
    const sortedEvents = [...groupEvents].sort((a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    );

    // Detect journey type from any event in the group
    let journeyType: 'lead' | 'review' | 'content' | undefined;
    for (const event of sortedEvents) {
      const detected = detectJourneyType(event.eventType);
      if (detected) {
        journeyType = detected;
        break;
      }
    }

    // Get latest timestamp for sorting groups
    const latestAt = new Date(
      Math.max(...sortedEvents.map(e => new Date(e.occurredAt).getTime()))
    );

    const group: ActivityGroup = {
      type: sortedEvents.length > 1 ? 'journey' : 'single',
      journeyType,
      sourceId,
      events: sortedEvents,
      summary: generateSummary(sortedEvents, journeyType),
      expandedByDefault: false,
      latestAt,
    };

    groups.push(group);
  }

  // Sort groups by latestAt DESC (newest first)
  groups.sort((a, b) => b.latestAt.getTime() - a.latestAt.getTime());

  return groups;
}

/**
 * Filter activity groups by type.
 *
 * Per CONTEXT.md: "Type filters available - Tabs: Reviews / Leads / Content / All"
 *
 * @param groups - Array of activity groups
 * @param filter - Filter type ('all', 'leads', 'reviews', 'content')
 * @returns Filtered array of activity groups
 */
export function filterByType(groups: ActivityGroup[], filter: ActivityFilter): ActivityGroup[] {
  if (filter === 'all') {
    return groups;
  }

  const typeMap: Record<Exclude<ActivityFilter, 'all'>, 'lead' | 'review' | 'content'> = {
    leads: 'lead',
    reviews: 'review',
    content: 'content',
  };

  const targetType = typeMap[filter];

  return groups.filter(group => group.journeyType === targetType);
}
