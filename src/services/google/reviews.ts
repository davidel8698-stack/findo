import { createAuthenticatedClient } from './oauth';

/**
 * Review data from Google Business Profile
 */
export interface Review {
  reviewId: string;
  name: string;          // Full resource name
  reviewerName: string;  // Reviewer display name
  starRating: number;    // 1-5
  comment?: string;      // Review text (nullable for rating-only reviews)
  createTime: string;    // ISO timestamp
  updateTime: string;    // ISO timestamp
  reply?: ReviewReply;
}

export interface ReviewReply {
  comment: string;
  updateTime: string;
}

export interface ListReviewsOptions {
  pageSize?: number;     // Default 50, max 50
  pageToken?: string;    // For pagination
  orderBy?: 'updateTime desc' | 'rating desc' | 'rating asc';
}

// GBP API base URL for reviews (My Business v4 API)
const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

// Response types from Google API
interface GoogleReviewResponse {
  name?: string;
  reviewer?: {
    displayName?: string;
  };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: {
    comment?: string;
    updateTime?: string;
  };
}

interface ListReviewsApiResponse {
  reviews?: GoogleReviewResponse[];
  nextPageToken?: string;
}

interface ReviewReplyApiResponse {
  comment?: string;
  updateTime?: string;
}

/**
 * List reviews for a location.
 *
 * Uses My Business API v4 for review access.
 * Note: Reviews are accessed via My Business API v4, not mybusinessbusinessinformation.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - Google Business Profile account ID
 * @param locationId - Location ID within the account
 * @param options - Pagination and ordering options
 * @returns Paginated list of reviews
 */
export async function listReviews(
  tenantId: string,
  accountId: string,
  locationId: string,
  options: ListReviewsOptions = {}
): Promise<{ reviews: Review[]; nextPageToken?: string }> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const params = new URLSearchParams();
  params.set('pageSize', String(options.pageSize || 50));
  if (options.pageToken) params.set('pageToken', options.pageToken);
  if (options.orderBy) params.set('orderBy', options.orderBy);

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/reviews?${params}`;

  const response = await client.request<ListReviewsApiResponse>({ url });

  const reviews = (response.data.reviews || []).map((r) => ({
    reviewId: r.name?.split('/').pop() || '',
    name: r.name || '',
    reviewerName: r.reviewer?.displayName || 'Anonymous',
    starRating: parseStarRating(r.starRating),
    comment: r.comment,
    createTime: r.createTime || '',
    updateTime: r.updateTime || '',
    reply: r.reviewReply ? {
      comment: r.reviewReply.comment || '',
      updateTime: r.reviewReply.updateTime || '',
    } : undefined,
  }));

  return {
    reviews,
    nextPageToken: response.data.nextPageToken,
  };
}

/**
 * Post a reply to a review.
 *
 * Reply text is limited to 4096 bytes. Hebrew characters count as 2-3 bytes each.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - Google Business Profile account ID
 * @param locationId - Location ID within the account
 * @param reviewId - Review ID to reply to
 * @param replyText - Reply text (max 4096 bytes)
 * @returns The posted reply details
 */
export async function postReviewReply(
  tenantId: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  replyText: string
): Promise<ReviewReply> {
  // Validate reply length (max 4096 bytes)
  const replyBytes = Buffer.byteLength(replyText, 'utf8');
  if (replyBytes > 4096) {
    throw new Error(`Reply exceeds 4096 bytes (${replyBytes} bytes). Hebrew characters count as 2-3 bytes each.`);
  }

  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`;

  const response = await client.request<ReviewReplyApiResponse>({
    url,
    method: 'PUT',
    data: {
      comment: replyText,
    },
  });

  return {
    comment: response.data.comment || replyText,
    updateTime: response.data.updateTime || new Date().toISOString(),
  };
}

/**
 * Delete a review reply.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - Google Business Profile account ID
 * @param locationId - Location ID within the account
 * @param reviewId - Review ID whose reply to delete
 */
export async function deleteReviewReply(
  tenantId: string,
  accountId: string,
  locationId: string,
  reviewId: string
): Promise<void> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`;

  await client.request({
    url,
    method: 'DELETE',
  });
}

/**
 * Get a single review by ID.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - Google Business Profile account ID
 * @param locationId - Location ID within the account
 * @param reviewId - Review ID to fetch
 * @returns Review details or null if not found
 */
export async function getReview(
  tenantId: string,
  accountId: string,
  locationId: string,
  reviewId: string
): Promise<Review | null> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}`;

  try {
    const response = await client.request<GoogleReviewResponse>({ url });

    const r = response.data;
    return {
      reviewId: r.name?.split('/').pop() || '',
      name: r.name || '',
      reviewerName: r.reviewer?.displayName || 'Anonymous',
      starRating: parseStarRating(r.starRating),
      comment: r.comment,
      createTime: r.createTime || '',
      updateTime: r.updateTime || '',
      reply: r.reviewReply ? {
        comment: r.reviewReply.comment || '',
        updateTime: r.reviewReply.updateTime || '',
      } : undefined,
    };
  } catch (error: any) {
    console.error('[google/reviews] Failed to get review:', error.message);
    return null;
  }
}

/**
 * Parse star rating enum to number.
 *
 * Google returns star rating as enum string (ONE, TWO, THREE, FOUR, FIVE).
 * Convert to numeric 1-5 for easier consumption.
 *
 * @param rating - Star rating enum string
 * @returns Numeric rating 1-5, or 0 if unknown
 */
function parseStarRating(rating?: string | null): number {
  if (!rating) return 0;

  const ratingMap: Record<string, number> = {
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5,
  };

  return ratingMap[rating] || 0;
}
