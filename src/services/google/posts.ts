/**
 * Google Business Profile Posts Service
 *
 * Create and manage local posts on GBP using My Business API v4.
 *
 * Per RESEARCH.md:
 * - Posts cannot contain phone numbers (Google rejects)
 * - Max 1500 chars, ideal 100-300
 * - Single media item per post (image)
 */

import { createAuthenticatedClient } from './oauth';

const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

export type PostTopicType = 'STANDARD' | 'EVENT' | 'OFFER';
export type CallToActionType = 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'SIGN_UP' | 'CALL';
export type PostState = 'LIVE' | 'PROCESSING' | 'REJECTED';

export interface LocalPost {
  postId: string;
  name: string;
  summary: string;
  topicType: PostTopicType;
  state: PostState;
  callToAction?: {
    actionType: CallToActionType;
    url: string;
  };
  media?: {
    sourceUrl: string;
    mediaFormat: 'PHOTO';
  };
  createTime: string;
  updateTime: string;
}

export interface CreatePostInput {
  summary: string;
  topicType?: PostTopicType;
  callToAction?: {
    actionType: CallToActionType;
    url: string;
  };
  mediaUrl?: string; // Optional image URL
}

interface PostApiResponse {
  name?: string;
  languageCode?: string;
  summary?: string;
  topicType?: string;
  state?: string;
  callToAction?: {
    actionType?: string;
    url?: string;
  };
  media?: Array<{
    sourceUrl?: string;
    mediaFormat?: string;
  }>;
  createTime?: string;
  updateTime?: string;
}

interface ListPostsApiResponse {
  localPosts?: PostApiResponse[];
  nextPageToken?: string;
}

// Phone number regex for validation (Israeli format variations)
const PHONE_REGEX = /\d{2,3}[-.\s]?\d{7}|\d{10}/;

/**
 * Create a local post on GBP.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - GBP account ID
 * @param locationId - Location ID
 * @param post - Post content
 * @returns Created post with state
 */
export async function createPost(
  tenantId: string,
  accountId: string,
  locationId: string,
  post: CreatePostInput
): Promise<LocalPost> {
  // Validate: No phone numbers (Google rejects these)
  if (PHONE_REGEX.test(post.summary)) {
    throw new Error('Posts cannot contain phone numbers per Google policy');
  }

  // Validate: Max 1500 chars
  if (post.summary.length > 1500) {
    throw new Error(`Post exceeds 1500 character limit (${post.summary.length} chars)`);
  }

  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/localPosts`;

  const body: Record<string, unknown> = {
    languageCode: 'he', // Hebrew
    summary: post.summary,
    topicType: post.topicType || 'STANDARD',
  };

  if (post.callToAction) {
    body.callToAction = post.callToAction;
  }

  if (post.mediaUrl) {
    body.media = [{
      mediaFormat: 'PHOTO',
      sourceUrl: post.mediaUrl,
    }];
  }

  const response = await client.request<PostApiResponse>({
    url,
    method: 'POST',
    data: body,
  });

  return mapPost(response.data);
}

/**
 * List local posts for a location.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - GBP account ID
 * @param locationId - Location ID
 * @param pageToken - Pagination token
 * @returns List of posts
 */
export async function listPosts(
  tenantId: string,
  accountId: string,
  locationId: string,
  pageToken?: string
): Promise<{ posts: LocalPost[]; nextPageToken?: string }> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const params = new URLSearchParams();
  if (pageToken) params.set('pageToken', pageToken);

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/localPosts?${params}`;

  const response = await client.request<ListPostsApiResponse>({ url });

  const posts = (response.data.localPosts || []).map(mapPost);

  return {
    posts,
    nextPageToken: response.data.nextPageToken,
  };
}

/**
 * Delete a local post.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - GBP account ID
 * @param locationId - Location ID
 * @param postId - Post ID to delete
 */
export async function deletePost(
  tenantId: string,
  accountId: string,
  locationId: string,
  postId: string
): Promise<void> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/localPosts/${postId}`;

  await client.request({
    url,
    method: 'DELETE',
  });
}

/**
 * Map API response to LocalPost type.
 */
function mapPost(data: PostApiResponse): LocalPost {
  return {
    postId: data.name?.split('/').pop() || '',
    name: data.name || '',
    summary: data.summary || '',
    topicType: (data.topicType as PostTopicType) || 'STANDARD',
    state: (data.state as PostState) || 'PROCESSING',
    callToAction: data.callToAction?.actionType
      ? {
          actionType: data.callToAction.actionType as CallToActionType,
          url: data.callToAction.url || '',
        }
      : undefined,
    media: data.media?.[0]
      ? {
          sourceUrl: data.media[0].sourceUrl || '',
          mediaFormat: 'PHOTO',
        }
      : undefined,
    createTime: data.createTime || '',
    updateTime: data.updateTime || '',
  };
}
