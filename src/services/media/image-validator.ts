/**
 * Image Validation Service
 *
 * Validates images before upload to GBP:
 * - Minimum dimensions: 250x250px (GBP requirement)
 * - Supported formats: JPEG, PNG, WebP
 * - Blur detection using Laplacian variance
 *
 * Per RESEARCH.md: Use sharp for all image processing.
 */

import sharp from 'sharp';

export interface ImageValidationResult {
  valid: boolean;
  reason?: string;
  width: number;
  height: number;
  format: string;
  sharpnessScore: number;
}

// Minimum dimensions for GBP
const MIN_DIMENSION = 250;
// Blur threshold (empirical, adjust based on feedback)
const BLUR_THRESHOLD = 50;
// Supported formats
const SUPPORTED_FORMATS = ['jpeg', 'png', 'webp'];

/**
 * Validate an image for GBP upload.
 *
 * Checks:
 * - Dimensions >= 250x250
 * - Format is JPEG, PNG, or WebP
 * - Image is not blurry (Laplacian variance)
 *
 * @param buffer - Image buffer
 * @returns Validation result with details
 */
export async function validateImage(buffer: Buffer): Promise<ImageValidationResult> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Check if we can read the image
    if (!metadata.width || !metadata.height) {
      return {
        valid: false,
        reason: 'Could not read image dimensions',
        width: 0,
        height: 0,
        format: '',
        sharpnessScore: 0,
      };
    }

    // Check dimensions
    if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
      return {
        valid: false,
        reason: `התמונה קטנה מדי (${metadata.width}x${metadata.height}). צריך לפחות ${MIN_DIMENSION}x${MIN_DIMENSION}`,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format || '',
        sharpnessScore: 0,
      };
    }

    // Check format
    const format = metadata.format || '';
    if (!SUPPORTED_FORMATS.includes(format)) {
      return {
        valid: false,
        reason: `פורמט לא נתמך: ${format}. נא לשלוח JPEG, PNG או WebP`,
        width: metadata.width,
        height: metadata.height,
        format,
        sharpnessScore: 0,
      };
    }

    // Blur detection using Laplacian variance
    // Apply Laplacian kernel and measure variance
    const stats = await sharp(buffer)
      .greyscale()
      .convolve({
        width: 3,
        height: 3,
        kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0], // Laplacian kernel
      })
      .stats();

    // Use standard deviation as sharpness indicator
    // Higher values = more edges = sharper image
    const sharpnessScore = stats.channels[0]?.stdev || 0;
    const isBlurry = sharpnessScore < BLUR_THRESHOLD;

    if (isBlurry) {
      return {
        valid: false,
        reason: 'התמונה נראית מטושטשת. נא לשלוח תמונה חדה יותר',
        width: metadata.width,
        height: metadata.height,
        format,
        sharpnessScore,
      };
    }

    return {
      valid: true,
      width: metadata.width,
      height: metadata.height,
      format,
      sharpnessScore,
    };
  } catch (error) {
    return {
      valid: false,
      reason: 'לא הצלחנו לקרוא את התמונה. נא לנסות שוב',
      width: 0,
      height: 0,
      format: '',
      sharpnessScore: 0,
    };
  }
}

/**
 * Prepare image for upload by optimizing and converting to JPEG.
 *
 * - Converts to JPEG (most compatible)
 * - Strips EXIF data for privacy
 * - Maintains orientation
 * - Quality 85 (good balance of size/quality)
 *
 * @param buffer - Original image buffer
 * @returns Optimized JPEG buffer
 */
export async function prepareImageForUpload(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate() // Auto-rotate based on EXIF orientation
    .jpeg({
      quality: 85,
      mozjpeg: true, // Better compression
    })
    .toBuffer();
}
