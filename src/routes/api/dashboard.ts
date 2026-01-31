import { Hono } from 'hono';
import { tenantContext } from '../../middleware/tenant-context';
import { getStatsForPeriod, type TimePeriod, type DashboardStats } from '../../services/dashboard/stats-aggregator';
import { getHealthStatus, type HealthStatus } from '../../services/dashboard/health-checker';
import { groupActivityEvents, filterByType, type ActivityFilter, type ActivityGroup } from '../../services/dashboard/activity-grouper';
import { getTrendsData, type TrendsPeriod, type TrendsData } from '../../services/dashboard/trends-aggregator';
import { activityService } from '../../services/activity';
import type { TenantContext } from '../../types/tenant-context';
import { db } from '../../db';
import { processedReviews, googleConnections, photoRequests, gbpPhotos, postRequests, tenants } from '../../db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { postReviewReply } from '../../services/google/reviews';
import { validateImage, prepareImageForUpload } from '../../services/media/image-validator';
import { uploadToR2, isR2Configured } from '../../services/storage/r2';
import { uploadPhotoFromUrl, type PhotoCategory } from '../../services/google/media';
import { generatePostContent } from '../../services/gbp-content/post-generator';
import { createPost } from '../../services/google/posts';

// Extend Hono Variables for tenant context
type Variables = {
  tenant: TenantContext;
};

/**
 * Dashboard API Routes
 *
 * Provides stats and health data for the main dashboard.
 * Per CONTEXT.md: "Health status on top" and "Switchable time periods - Today / This Week / This Month"
 */
const app = new Hono<{ Variables: Variables }>();

// Apply tenant context middleware to all routes
app.use('*', tenantContext);

/**
 * GET /api/dashboard/stats
 *
 * Returns aggregated stats for the dashboard cards.
 *
 * Query params:
 * - period: 'today' | 'week' | 'month' (default: 'today')
 *
 * Returns:
 * - stats: DashboardStats object with counts and rating
 *
 * Per DASH-01: "Main screen shows daily stats (calls received, unanswered, WhatsApp sent, new reviews, current rating)"
 */
app.get('/stats', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  // Get period from query string, validate and default to 'today'
  const periodParam = c.req.query('period') || 'today';

  // Validate period value
  const validPeriods: TimePeriod[] = ['today', 'week', 'month'];
  if (!validPeriods.includes(periodParam as TimePeriod)) {
    return c.json({
      error: `Invalid period value. Must be one of: ${validPeriods.join(', ')}`
    }, 400);
  }

  const period = periodParam as TimePeriod;

  try {
    const stats: DashboardStats = await getStatsForPeriod(tenant.tenantId, period);

    return c.json({ stats });
  } catch (error) {
    console.error('[dashboard/stats] Error fetching stats:', error);
    return c.json({
      error: 'Failed to fetch dashboard stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * GET /api/dashboard/health
 *
 * Returns system health status for the dashboard indicator.
 *
 * No params required.
 *
 * Returns:
 * - health: HealthStatus object with overall status and component breakdown
 *
 * Per CONTEXT.md: "Traffic light (green/yellow/red) PLUS component breakdown (WhatsApp checkmark, Google checkmark, Reviews warning)"
 */
app.get('/health', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    const health: HealthStatus = await getHealthStatus(tenant.tenantId);

    return c.json({ health });
  } catch (error) {
    console.error('[dashboard/health] Error fetching health status:', error);
    return c.json({
      error: 'Failed to fetch health status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * GET /api/dashboard/activity
 *
 * Returns grouped activity events for the activity feed.
 *
 * Query params:
 * - limit: number (default 50)
 * - offset: number (default 0)
 * - filter: 'all' | 'leads' | 'reviews' | 'content' (default 'all')
 *
 * Returns:
 * - groups: ActivityGroup[] with grouped events
 * - hasMore: boolean indicating if more events exist
 *
 * Per CONTEXT.md: "Smart grouping - Group related events"
 */
app.get('/activity', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  // Parse query parameters
  const limitParam = c.req.query('limit');
  const offsetParam = c.req.query('offset');
  const filterParam = c.req.query('filter') || 'all';

  const limit = limitParam ? parseInt(limitParam, 10) : 50;
  const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

  // Validate filter value
  const validFilters: ActivityFilter[] = ['all', 'leads', 'reviews', 'content'];
  if (!validFilters.includes(filterParam as ActivityFilter)) {
    return c.json({
      error: `Invalid filter value. Must be one of: ${validFilters.join(', ')}`
    }, 400);
  }

  const filter = filterParam as ActivityFilter;

  try {
    // Fetch raw activity events
    // Fetch more than requested to account for grouping
    const events = await activityService.getFeed(tenant.tenantId, {
      limit: limit * 2, // Fetch extra to handle grouping
      offset,
    });

    // Group events by sourceId
    const allGroups = groupActivityEvents(events);

    // Apply filter
    const filteredGroups = filterByType(allGroups, filter);

    // Paginate groups
    const paginatedGroups = filteredGroups.slice(0, limit);

    // Check if more exist
    const hasMore = filteredGroups.length > limit || events.length === limit * 2;

    return c.json({
      groups: paginatedGroups,
      hasMore,
    });
  } catch (error) {
    console.error('[dashboard/activity] Error fetching activity:', error);
    return c.json({
      error: 'Failed to fetch activity feed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * GET /api/dashboard/trends
 *
 * Returns trends data for reports charts.
 *
 * Query params:
 * - period: 'weekly' | 'monthly' (default: 'weekly')
 *
 * Returns:
 * - TrendsData object with labels and metric arrays
 *
 * Per DASH-06: "View weekly/monthly reports and performance trends with clear graphs"
 */
app.get('/trends', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  // Get period from query string, validate and default to 'weekly'
  const periodParam = c.req.query('period') || 'weekly';

  // Validate period value
  const validPeriods: TrendsPeriod[] = ['weekly', 'monthly'];
  if (!validPeriods.includes(periodParam as TrendsPeriod)) {
    return c.json({
      error: `Invalid period value. Must be one of: ${validPeriods.join(', ')}`
    }, 400);
  }

  const period = periodParam as TrendsPeriod;

  try {
    const trends: TrendsData = await getTrendsData(tenant.tenantId, period);

    return c.json(trends);
  } catch (error) {
    console.error('[dashboard/trends] Error fetching trends:', error);
    return c.json({
      error: 'Failed to fetch trends data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * GET /api/dashboard/pending-reviews
 *
 * Returns list of reviews pending owner approval.
 *
 * Per DASH-03: "Approve/edit negative review responses before posting"
 *
 * Returns:
 * - reviews: Array of pending reviews with reviewId, reviewerName, starRating, comment, draftReply, approvalSentAt
 */
app.get('/pending-reviews', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    const reviews = await db
      .select({
        reviewId: processedReviews.reviewId,
        reviewerName: processedReviews.reviewerName,
        starRating: processedReviews.starRating,
        comment: processedReviews.comment,
        draftReply: processedReviews.draftReply,
        approvalSentAt: processedReviews.approvalSentAt,
      })
      .from(processedReviews)
      .where(
        and(
          eq(processedReviews.tenantId, tenant.tenantId),
          eq(processedReviews.status, 'pending_approval')
        )
      )
      .orderBy(processedReviews.approvalSentAt);

    return c.json({ reviews });
  } catch (error) {
    console.error('[dashboard/pending-reviews] Error fetching reviews:', error);
    return c.json({
      error: 'Failed to fetch pending reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * POST /api/dashboard/review/:reviewId/approve
 *
 * Approves a pending review and posts reply to Google.
 *
 * Body:
 * - customReply?: string - Optional edited reply text
 *
 * If customReply provided: use it, set status='edited'
 * If no customReply: use draftReply, set status='approved'
 *
 * Per DASH-03: "Approve/edit negative review responses before posting"
 */
app.post('/review/:reviewId/approve', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  const reviewId = c.req.param('reviewId');
  let body: { customReply?: string } = {};

  try {
    body = await c.req.json();
  } catch {
    // Empty body is valid - means use draft reply
  }

  try {
    // Get the review
    const [review] = await db
      .select()
      .from(processedReviews)
      .where(
        and(
          eq(processedReviews.tenantId, tenant.tenantId),
          eq(processedReviews.reviewId, reviewId),
          eq(processedReviews.status, 'pending_approval')
        )
      )
      .limit(1);

    if (!review) {
      return c.json({ error: 'Review not found or not pending approval' }, 404);
    }

    // Get Google connection for posting
    const [googleConnection] = await db
      .select()
      .from(googleConnections)
      .where(eq(googleConnections.tenantId, tenant.tenantId))
      .limit(1);

    if (!googleConnection || !googleConnection.locationId) {
      return c.json({ error: 'No Google connection configured' }, 400);
    }

    // Determine reply text and status
    const replyText = body.customReply || review.draftReply;
    const newStatus = body.customReply ? 'edited' : 'approved';

    if (!replyText) {
      return c.json({ error: 'No reply text available' }, 400);
    }

    // Post reply to Google
    const postedReply = await postReviewReply(
      tenant.tenantId,
      googleConnection.accountId,
      googleConnection.locationId,
      reviewId,
      replyText
    );

    // Update review record
    await db
      .update(processedReviews)
      .set({
        status: 'replied',
        postedReply: replyText,
        repliedAt: new Date(),
        ownerResponse: body.customReply || null,
        updatedAt: new Date(),
      })
      .where(eq(processedReviews.id, review.id));

    console.log(`[dashboard/approve] Review ${reviewId} approved and replied (status: ${newStatus})`);

    return c.json({
      success: true,
      message: 'Reply posted successfully',
      replyText,
      repliedAt: postedReply.updateTime,
    });
  } catch (error) {
    console.error('[dashboard/approve] Error approving review:', error);
    return c.json({
      error: 'Failed to approve and post reply',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * GET /api/dashboard/photo-request
 *
 * Returns current photo request status for tenant.
 *
 * Per DASH-04: "Upload photos when system requests"
 *
 * Returns:
 * - hasPending: boolean
 * - requestId?: string
 * - requestedAt?: Date
 */
app.get('/photo-request', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    // Get most recent pending photo request
    const [request] = await db
      .select({
        id: photoRequests.id,
        requestedAt: photoRequests.requestedAt,
        status: photoRequests.status,
      })
      .from(photoRequests)
      .where(
        and(
          eq(photoRequests.tenantId, tenant.tenantId),
          eq(photoRequests.status, 'sent'),
          isNull(photoRequests.deletedAt)
        )
      )
      .orderBy(desc(photoRequests.requestedAt))
      .limit(1);

    if (request) {
      return c.json({
        hasPending: true,
        requestId: request.id,
        requestedAt: request.requestedAt,
      });
    }

    return c.json({ hasPending: false });
  } catch (error) {
    console.error('[dashboard/photo-request] Error fetching request:', error);
    return c.json({
      error: 'Failed to fetch photo request status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * POST /api/dashboard/photo/upload
 *
 * Upload a photo to R2 and GBP.
 *
 * Content-Type: multipart/form-data
 * Body: photo (file)
 *
 * Per DASH-04: "Upload photos when system requests"
 */
app.post('/photo/upload', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    // Check R2 configuration
    if (!isR2Configured()) {
      return c.json({ error: 'Storage not configured' }, 500);
    }

    // Get Google connection
    const [googleConnection] = await db
      .select()
      .from(googleConnections)
      .where(eq(googleConnections.tenantId, tenant.tenantId))
      .limit(1);

    if (!googleConnection || !googleConnection.locationId) {
      return c.json({ error: 'No Google connection configured' }, 400);
    }

    // Parse multipart form
    const formData = await c.req.formData();
    const file = formData.get('photo');

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No photo file provided' }, 400);
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Must be JPEG or PNG' }, 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ error: 'File too large. Maximum 10MB' }, 400);
    }

    // Read file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate image (dimensions, format, blur)
    const validation = await validateImage(buffer);
    if (!validation.valid) {
      return c.json({ error: validation.reason }, 400);
    }

    // Prepare image for upload (optimize, convert to JPEG)
    const optimizedBuffer = await prepareImageForUpload(buffer);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}.jpg`;

    // Upload to R2
    const { publicUrl } = await uploadToR2(
      tenant.tenantId,
      filename,
      optimizedBuffer,
      'image/jpeg'
    );

    console.log(`[dashboard/photo-upload] Uploaded to R2: ${publicUrl}`);

    // Upload to GBP
    const category: PhotoCategory = 'ADDITIONAL';
    const gbpPhoto = await uploadPhotoFromUrl(
      tenant.tenantId,
      googleConnection.accountId,
      googleConnection.locationId,
      publicUrl,
      category
    );

    console.log(`[dashboard/photo-upload] Uploaded to GBP: ${gbpPhoto.mediaItemId}`);

    // Save to database
    await db.insert(gbpPhotos).values({
      tenantId: tenant.tenantId,
      mediaItemId: gbpPhoto.mediaItemId,
      category,
      sourceUrl: publicUrl,
      status: 'processing',
      uploadedAt: new Date(),
    });

    // Update pending photo request if exists
    const [pendingRequest] = await db
      .select()
      .from(photoRequests)
      .where(
        and(
          eq(photoRequests.tenantId, tenant.tenantId),
          eq(photoRequests.status, 'sent'),
          isNull(photoRequests.deletedAt)
        )
      )
      .orderBy(desc(photoRequests.requestedAt))
      .limit(1);

    if (pendingRequest) {
      await db
        .update(photoRequests)
        .set({
          status: 'uploaded',
          uploadedAt: new Date(),
          gbpMediaIds: [...(pendingRequest.gbpMediaIds || []), gbpPhoto.mediaItemId],
          updatedAt: new Date(),
        })
        .where(eq(photoRequests.id, pendingRequest.id));
    }

    return c.json({
      success: true,
      publicUrl,
      mediaItemId: gbpPhoto.mediaItemId,
    });
  } catch (error) {
    console.error('[dashboard/photo-upload] Error uploading photo:', error);
    return c.json({
      error: 'Failed to upload photo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * GET /api/dashboard/post-request
 *
 * Returns current post request status for tenant.
 *
 * Per DASH-05: "Enter promotional content for monthly posts"
 *
 * Returns:
 * - hasPending: boolean
 * - post?: { id, status, content, isSafe, createdAt }
 */
app.get('/post-request', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    // Get most recent pending post request (requested or pending_approval)
    const [request] = await db
      .select({
        id: postRequests.id,
        status: postRequests.status,
        ownerContent: postRequests.ownerContent,
        aiDraft: postRequests.aiDraft,
        finalContent: postRequests.finalContent,
        isSafeContent: postRequests.isSafeContent,
        createdAt: postRequests.createdAt,
      })
      .from(postRequests)
      .where(
        and(
          eq(postRequests.tenantId, tenant.tenantId),
          isNull(postRequests.deletedAt)
        )
      )
      .orderBy(desc(postRequests.createdAt))
      .limit(1);

    if (request && (request.status === 'requested' || request.status === 'pending_approval')) {
      return c.json({
        hasPending: true,
        post: {
          id: request.id,
          status: request.status,
          content: request.aiDraft || request.finalContent || request.ownerContent,
          isSafe: request.isSafeContent,
          createdAt: request.createdAt,
        },
      });
    }

    return c.json({ hasPending: false });
  } catch (error) {
    console.error('[dashboard/post-request] Error fetching request:', error);
    return c.json({
      error: 'Failed to fetch post request status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * POST /api/dashboard/post/generate
 *
 * Generate AI post content from owner's input.
 *
 * Body:
 * - content: string - Owner's promotional content
 *
 * Per DASH-05: "Enter promotional content for monthly posts"
 */
app.post('/post/generate', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  let body: { content: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  if (!body.content || body.content.trim().length === 0) {
    return c.json({ error: 'Content is required' }, 400);
  }

  if (body.content.length > 1500) {
    return c.json({ error: 'Content exceeds 1500 character limit' }, 400);
  }

  try {
    // Get tenant info for business name/type
    const [tenantInfo] = await db
      .select({
        businessName: tenants.businessName,
        businessType: tenants.businessType,
      })
      .from(tenants)
      .where(eq(tenants.id, tenant.tenantId))
      .limit(1);

    if (!tenantInfo) {
      return c.json({ error: 'Tenant not found' }, 404);
    }

    // Generate AI post
    const generatedPost = await generatePostContent({
      businessName: tenantInfo.businessName,
      businessType: tenantInfo.businessType || 'business',
      ownerContent: body.content,
    });

    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Create or update post request
    const [existingRequest] = await db
      .select()
      .from(postRequests)
      .where(
        and(
          eq(postRequests.tenantId, tenant.tenantId),
          eq(postRequests.month, month),
          eq(postRequests.year, year),
          isNull(postRequests.deletedAt)
        )
      )
      .limit(1);

    let postId: string;

    if (existingRequest) {
      // Update existing
      await db
        .update(postRequests)
        .set({
          status: 'pending_approval',
          ownerContent: body.content,
          aiDraft: generatedPost.summary,
          isSafeContent: generatedPost.isSafe,
          postType: generatedPost.topicType,
          callToActionType: generatedPost.callToActionType,
          draftSentAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(postRequests.id, existingRequest.id));
      postId = existingRequest.id;
    } else {
      // Create new
      const [newRequest] = await db
        .insert(postRequests)
        .values({
          tenantId: tenant.tenantId,
          status: 'pending_approval',
          month,
          year,
          ownerContent: body.content,
          aiDraft: generatedPost.summary,
          isSafeContent: generatedPost.isSafe,
          postType: generatedPost.topicType,
          callToActionType: generatedPost.callToActionType,
          draftSentAt: new Date(),
        })
        .returning({ id: postRequests.id });
      postId = newRequest.id;
    }

    console.log(`[dashboard/post-generate] Generated post for tenant ${tenant.tenantId}`);

    return c.json({
      success: true,
      postId,
      content: generatedPost.summary,
      isSafe: generatedPost.isSafe,
      topicType: generatedPost.topicType,
    });
  } catch (error) {
    console.error('[dashboard/post-generate] Error generating post:', error);
    return c.json({
      error: 'Failed to generate post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * POST /api/dashboard/post/:postId/approve
 *
 * Approve and publish a post to GBP.
 *
 * Body:
 * - customContent?: string - Optional edited content
 *
 * Per DASH-05: "Enter promotional content for monthly posts"
 */
app.post('/post/:postId/approve', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  const postId = c.req.param('postId');
  let body: { customContent?: string } = {};

  try {
    body = await c.req.json();
  } catch {
    // Empty body is valid - means use AI draft
  }

  try {
    // Get the post request
    const [postRequest] = await db
      .select()
      .from(postRequests)
      .where(
        and(
          eq(postRequests.id, postId),
          eq(postRequests.tenantId, tenant.tenantId),
          eq(postRequests.status, 'pending_approval')
        )
      )
      .limit(1);

    if (!postRequest) {
      return c.json({ error: 'Post not found or not pending approval' }, 404);
    }

    // Get Google connection
    const [googleConnection] = await db
      .select()
      .from(googleConnections)
      .where(eq(googleConnections.tenantId, tenant.tenantId))
      .limit(1);

    if (!googleConnection || !googleConnection.locationId) {
      return c.json({ error: 'No Google connection configured' }, 400);
    }

    // Determine final content
    const finalContent = body.customContent || postRequest.aiDraft || postRequest.ownerContent;

    if (!finalContent) {
      return c.json({ error: 'No content available to publish' }, 400);
    }

    // Create post on GBP
    const gbpPost = await createPost(
      tenant.tenantId,
      googleConnection.accountId,
      googleConnection.locationId,
      {
        summary: finalContent,
        topicType: postRequest.postType || 'STANDARD',
        callToAction: postRequest.callToActionType && postRequest.callToActionUrl
          ? {
              actionType: postRequest.callToActionType as any,
              url: postRequest.callToActionUrl,
            }
          : undefined,
      }
    );

    // Update post request
    await db
      .update(postRequests)
      .set({
        status: 'published',
        finalContent,
        gbpPostId: gbpPost.postId,
        gbpPostState: gbpPost.state,
        approvedAt: new Date(),
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(postRequests.id, postId));

    console.log(`[dashboard/post-approve] Post ${postId} published: ${gbpPost.postId}`);

    return c.json({
      success: true,
      message: 'Post published successfully',
      gbpPostId: gbpPost.postId,
      state: gbpPost.state,
    });
  } catch (error) {
    console.error('[dashboard/post-approve] Error publishing post:', error);
    return c.json({
      error: 'Failed to publish post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * POST /api/dashboard/post/:postId/regenerate
 *
 * Regenerate AI content for a pending post using the original owner content.
 *
 * Per user request: "Add option to regenerate AI suggestion"
 */
app.post('/post/:postId/regenerate', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  const postId = c.req.param('postId');

  try {
    // Get the post request
    const [postRequest] = await db
      .select()
      .from(postRequests)
      .where(
        and(
          eq(postRequests.id, postId),
          eq(postRequests.tenantId, tenant.tenantId),
          eq(postRequests.status, 'pending_approval')
        )
      )
      .limit(1);

    if (!postRequest) {
      return c.json({ error: 'Post not found or not pending approval' }, 404);
    }

    if (!postRequest.ownerContent) {
      return c.json({ error: 'No original content to regenerate from' }, 400);
    }

    // Get tenant info for business name/type
    const [tenantInfo] = await db
      .select({
        businessName: tenants.businessName,
        businessType: tenants.businessType,
      })
      .from(tenants)
      .where(eq(tenants.id, tenant.tenantId))
      .limit(1);

    if (!tenantInfo) {
      return c.json({ error: 'Tenant not found' }, 404);
    }

    // Generate new AI post
    const generatedPost = await generatePostContent({
      businessName: tenantInfo.businessName,
      businessType: tenantInfo.businessType || 'business',
      ownerContent: postRequest.ownerContent,
    });

    // Update post request with new AI draft
    await db
      .update(postRequests)
      .set({
        aiDraft: generatedPost.summary,
        isSafeContent: generatedPost.isSafe,
        postType: generatedPost.topicType,
        callToActionType: generatedPost.callToActionType,
        draftSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(postRequests.id, postId));

    console.log(`[dashboard/post-regenerate] Regenerated post for tenant ${tenant.tenantId}`);

    return c.json({
      success: true,
      content: generatedPost.summary,
      isSafe: generatedPost.isSafe,
      topicType: generatedPost.topicType,
    });
  } catch (error) {
    console.error('[dashboard/post-regenerate] Error regenerating post:', error);
    return c.json({
      error: 'Failed to regenerate post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * DELETE /api/dashboard/post/:postId
 *
 * Delete a pending post draft.
 *
 * Per user request: "Add option to delete AI suggestion"
 */
app.delete('/post/:postId', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  const postId = c.req.param('postId');

  try {
    // Get the post request
    const [postRequest] = await db
      .select()
      .from(postRequests)
      .where(
        and(
          eq(postRequests.id, postId),
          eq(postRequests.tenantId, tenant.tenantId)
        )
      )
      .limit(1);

    if (!postRequest) {
      return c.json({ error: 'Post not found' }, 404);
    }

    // Don't allow deleting already published posts
    if (postRequest.status === 'published') {
      return c.json({ error: 'Cannot delete published posts' }, 400);
    }

    // Soft delete the post
    await db
      .update(postRequests)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(postRequests.id, postId));

    console.log(`[dashboard/post-delete] Deleted post ${postId} for tenant ${tenant.tenantId}`);

    return c.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('[dashboard/post-delete] Error deleting post:', error);
    return c.json({
      error: 'Failed to delete post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export const dashboardApiRoutes = app;
