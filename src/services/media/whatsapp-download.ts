/**
 * WhatsApp Media Download Service
 *
 * Downloads media from WhatsApp Cloud API using two-step process:
 * 1. Get media URL from Graph API
 * 2. Download from lookaside URL (expires in 5 minutes!)
 *
 * CRITICAL: WhatsApp media URLs expire in 5 minutes. Always download
 * immediately when webhook received, never store the URL for later.
 */

const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export interface WhatsAppMediaMetadata {
  url: string;
  mime_type: string;
  sha256: string;
  file_size: number;
  id: string;
}

export interface DownloadedMedia {
  buffer: Buffer;
  mimeType: string;
  fileSize: number;
  mediaId: string;
}

/**
 * Get media metadata including download URL.
 * The URL expires in 5 minutes!
 */
export async function getMediaMetadata(
  mediaId: string,
  accessToken: string
): Promise<WhatsAppMediaMetadata> {
  const response = await fetch(`${GRAPH_API_BASE}/${mediaId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get media metadata: ${response.status} ${error}`);
  }

  return response.json() as Promise<WhatsAppMediaMetadata>;
}

/**
 * Download media from WhatsApp.
 *
 * Two-step process:
 * 1. Get media URL from Graph API
 * 2. Download from lookaside URL with auth header
 *
 * @param mediaId - WhatsApp media ID from webhook
 * @param accessToken - WhatsApp access token
 * @returns Downloaded media buffer with metadata
 */
export async function downloadWhatsAppMedia(
  mediaId: string,
  accessToken: string
): Promise<DownloadedMedia> {
  // Step 1: Get the download URL
  const metadata = await getMediaMetadata(mediaId, accessToken);

  // Step 2: Download from lookaside URL (requires auth header)
  const mediaResponse = await fetch(metadata.url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Findo/1.0',
    },
  });

  if (!mediaResponse.ok) {
    throw new Error(`Failed to download media: ${mediaResponse.status}`);
  }

  const buffer = Buffer.from(await mediaResponse.arrayBuffer());

  return {
    buffer,
    mimeType: metadata.mime_type,
    fileSize: metadata.file_size,
    mediaId: metadata.id,
  };
}
