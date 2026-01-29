/**
 * GBP Content Service Exports
 *
 * Provides AI-powered content generation for Google Business Profile
 * posts, including promotional posts and safe auto-publish content.
 * Also handles photo processing for GBP uploads.
 */

// Photo processing
export {
  processReceivedPhoto,
  handleCategorySelection,
  hasPendingPhoto,
  getISOWeek,
  type ProcessedPhoto,
} from './photo-processor';

// Post generation
export {
  generatePostContent,
  generateSafeAutoContent,
  type PostContent,
  type GeneratePostOptions,
} from './post-generator';
