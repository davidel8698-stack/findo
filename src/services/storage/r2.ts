/**
 * Cloudflare R2 Storage Service
 *
 * S3-compatible storage for photo uploads.
 * Provides public URLs for GBP media uploads.
 *
 * Requires env vars:
 * - R2_ACCOUNT_ID
 * - R2_ACCESS_KEY_ID
 * - R2_SECRET_ACCESS_KEY
 * - R2_BUCKET_NAME
 * - R2_PUBLIC_URL (the public access URL for the bucket)
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Lazy initialization to avoid errors when env vars not set
let r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }
  return r2Client;
}

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'findo-photos';

export interface UploadResult {
  key: string;
  publicUrl: string;
}

/**
 * Upload a photo buffer to R2 storage.
 *
 * @param tenantId - Tenant UUID (used in path)
 * @param filename - Filename (e.g., mediaId.jpg)
 * @param buffer - Image buffer
 * @param contentType - MIME type (default: image/jpeg)
 * @returns Upload result with public URL
 */
export async function uploadToR2(
  tenantId: string,
  filename: string,
  buffer: Buffer,
  contentType: string = 'image/jpeg'
): Promise<UploadResult> {
  const key = `photos/${tenantId}/${filename}`;
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    })
  );

  const publicUrl = getPublicUrl(key);
  console.log(`[r2] Uploaded ${key} -> ${publicUrl}`);

  return { key, publicUrl };
}

/**
 * Get the public URL for an R2 object.
 *
 * @param key - Object key in bucket
 * @returns Public URL
 */
export function getPublicUrl(key: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    throw new Error('R2_PUBLIC_URL environment variable not set');
  }
  // Ensure no double slashes
  const baseUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
  return `${baseUrl}/${key}`;
}

/**
 * Check if R2 is configured.
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
  );
}
