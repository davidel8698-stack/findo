// Google services barrel export

// OAuth services
export {
  getAuthUrl,
  handleCallback,
  getGoogleConnection,
  disconnectGoogle,
  createAuthenticatedClient,
} from './oauth';

// Token refresh services
export {
  refreshExpiringGoogleTokens,
  validateGoogleToken,
  validateAllGoogleTokens,
} from './token-refresh';

// Profile services
export {
  getLocations,
  getBusinessProfile,
  getAccountInfo,
  type BusinessProfile,
  type LocationInfo,
} from './profile';

// Reviews services
export {
  listReviews,
  postReviewReply,
  deleteReviewReply,
  getReview,
  type Review,
  type ReviewReply,
  type ListReviewsOptions,
} from './reviews';

// Posts services
export {
  createPost,
  listPosts,
  deletePost,
  type LocalPost,
  type CreatePostInput,
  type PostTopicType,
  type CallToActionType,
  type PostState,
} from './posts';

// Media services
export {
  uploadPhotoFromUrl,
  listPhotos,
  deletePhoto,
  type GBPPhoto,
  type PhotoCategory,
} from './media';

// Hours services
export {
  getLocationHours,
  setSpecialHours,
  createSingleDayPeriod,
  type SpecialHourPeriod,
  type RegularHours,
} from './hours';

// Performance services
export {
  getPerformanceMetrics,
  getMediaMetrics,
  dateRangeForWeek,
  dateRangeForMonth,
  type PerformanceMetrics,
  type MediaMetrics,
  type DateRange,
} from './performance';
