/**
 * Google Business Profile Media Service
 *
 * Upload and manage photos on GBP using My Business API v4.
 * Photos must be uploaded via public URL (sourceUrl).
 *
 * Per RESEARCH.md: Use direct HTTP like reviews.ts pattern.
 */

import { createAuthenticatedClient } from './oauth';

const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

// GBP photo categories
export type PhotoCategory =
  | 'COVER'
  | 'PROFILE'
  | 'EXTERIOR'
  | 'INTERIOR'
  | 'PRODUCT'
  | 'AT_WORK'
  | 'FOOD_AND_DRINK'
  | 'MENU'
  | 'COMMON_AREA'
  | 'ROOMS'
  | 'TEAMS'
  | 'ADDITIONAL';

export interface GBPPhoto {
  mediaItemId: string;
  name: string;
  category: PhotoCategory;
  googleUrl?: string;
  thumbnailUrl?: string;
  createTime: string;
}

interface MediaCreateRequest {
  mediaFormat: 'PHOTO';
  locationAssociation: {
    category: PhotoCategory;
  };
  sourceUrl: string;
}

interface MediaApiResponse {
  name: string;
  mediaFormat?: string;
  googleUrl?: string;
  thumbnailUrl?: string;
  createTime?: string;
  locationAssociation?: {
    category?: string;
  };
}

interface ListMediaApiResponse {
  mediaItems?: MediaApiResponse[];
  nextPageToken?: string;
}

/**
 * Upload a photo to GBP from a public URL.
 *
 * The sourceUrl must be publicly accessible for Google to fetch.
 * Use S3 or similar with public read access.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - GBP account ID
 * @param locationId - Location ID
 * @param sourceUrl - Public URL of the image
 * @param category - Photo category
 * @returns Uploaded photo metadata
 */
export async function uploadPhotoFromUrl(
  tenantId: string,
  accountId: string,
  locationId: string,
  sourceUrl: string,
  category: PhotoCategory
): Promise<GBPPhoto> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/media`;

  const body: MediaCreateRequest = {
    mediaFormat: 'PHOTO',
    locationAssociation: { category },
    sourceUrl,
  };

  const response = await client.request<MediaApiResponse>({
    url,
    method: 'POST',
    data: body,
  });

  return {
    mediaItemId: response.data.name?.split('/').pop() || '',
    name: response.data.name || '',
    category,
    googleUrl: response.data.googleUrl,
    thumbnailUrl: response.data.thumbnailUrl,
    createTime: response.data.createTime || new Date().toISOString(),
  };
}

/**
 * List photos for a location.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - GBP account ID
 * @param locationId - Location ID
 * @param pageToken - Pagination token
 * @returns List of photos
 */
export async function listPhotos(
  tenantId: string,
  accountId: string,
  locationId: string,
  pageToken?: string
): Promise<{ photos: GBPPhoto[]; nextPageToken?: string }> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const params = new URLSearchParams();
  if (pageToken) params.set('pageToken', pageToken);

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/media?${params}`;

  const response = await client.request<ListMediaApiResponse>({ url });

  const photos = (response.data.mediaItems || []).map((item) => ({
    mediaItemId: item.name?.split('/').pop() || '',
    name: item.name || '',
    category: (item.locationAssociation?.category as PhotoCategory) || 'ADDITIONAL',
    googleUrl: item.googleUrl,
    thumbnailUrl: item.thumbnailUrl,
    createTime: item.createTime || '',
  }));

  return {
    photos,
    nextPageToken: response.data.nextPageToken,
  };
}

/**
 * Delete a photo from GBP.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - GBP account ID
 * @param locationId - Location ID
 * @param mediaItemId - Media item ID to delete
 */
export async function deletePhoto(
  tenantId: string,
  accountId: string,
  locationId: string,
  mediaItemId: string
): Promise<void> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/media/${mediaItemId}`;

  await client.request({
    url,
    method: 'DELETE',
  });
}
