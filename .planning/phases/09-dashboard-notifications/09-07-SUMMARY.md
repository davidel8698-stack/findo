---
phase: "09"
plan: "07"
subsystem: dashboard
tags: ["dashboard", "actions", "reviews", "photos", "posts", "modals"]

dependency-graph:
  requires: ["09-03", "09-04"]
  provides: ["dashboard-actions", "review-approval-ui", "photo-upload-ui", "post-content-ui"]
  affects: ["09-08"]

tech-stack:
  added: []
  patterns: ["modal-overlays", "action-cards", "multipart-form-upload"]

key-files:
  created:
    - src/views/dashboard/review-approval.ts
    - src/views/dashboard/photo-upload.ts
    - src/views/dashboard/post-content.ts
  modified:
    - src/routes/api/dashboard.ts
    - src/views/dashboard/main.ts

decisions:
  - context: "Action component rendering"
    choice: "Inline modal overlays with separate components"
    rationale: "Reusable components can be rendered in modals or standalone pages"
  - context: "Photo upload validation"
    choice: "Client-side pre-validation before upload"
    rationale: "Faster feedback, reduces failed uploads"
  - context: "Post generation flow"
    choice: "Two-step: generate then approve"
    rationale: "Matches WhatsApp flow, owner always sees content before publishing"

metrics:
  duration: "~8 min"
  completed: "2026-01-29"
---

# Phase 09 Plan 07: Dashboard Action Interfaces Summary

Dashboard action interfaces for review approval, photo upload, and post content management.

## One-liner

Dashboard action components with modals for review approval, photo upload, and post content management - mirroring WhatsApp capabilities.

## What Was Built

### Task 1: Review Approval Component and API
- **Component** (`review-approval.ts`):
  - Pending reviews list with reviewer name, star rating, time waiting
  - Modal for viewing/editing draft replies
  - Hebrew UI with approve/cancel buttons
  - JavaScript for loading and submitting approvals
- **API Endpoints**:
  - `GET /api/dashboard/pending-reviews` - List pending approval reviews
  - `POST /api/dashboard/review/:reviewId/approve` - Approve and post reply to Google

### Task 2: Photo Upload Component and API
- **Component** (`photo-upload.ts`):
  - Request status display (pending/none)
  - Drag & drop zone with file select
  - Image preview thumbnails before upload
  - Upload progress indicator
  - Client-side validation (size, type)
- **API Endpoints**:
  - `GET /api/dashboard/photo-request` - Check pending photo request
  - `POST /api/dashboard/photo/upload` - Upload photo to R2 and GBP

### Task 3: Post Content Component and Dashboard Integration
- **Component** (`post-content.ts`):
  - Post request status display
  - Content form with character counter (1500 char limit)
  - AI-generated post preview
  - Approval section with edit capability
- **API Endpoints**:
  - `GET /api/dashboard/post-request` - Check pending post request
  - `POST /api/dashboard/post/generate` - Generate AI post from content
  - `POST /api/dashboard/post/:postId/approve` - Publish post to GBP
- **Dashboard Integration** (`main.ts`):
  - Actions section with three cards (reviews, photos, posts)
  - Modal overlays for each action type
  - Action status counts on main dashboard
  - Keyboard escape to close modals

## Integration Points

### Services Used (No Duplication)
- `postReviewReply` from `google/reviews.ts` - Post replies to Google
- `validateImage`, `prepareImageForUpload` from `media/image-validator.ts` - Image validation
- `uploadToR2` from `storage/r2.ts` - Cloud storage upload
- `uploadPhotoFromUrl` from `google/media.ts` - GBP photo upload
- `generatePostContent` from `gbp-content/post-generator.ts` - AI post generation
- `createPost` from `google/posts.ts` - GBP post creation

### Database Tables
- `processedReviews` - Review approval status tracking
- `photoRequests` - Photo request lifecycle
- `postRequests` - Post request lifecycle
- `gbpPhotos` - GBP photo records
- `googleConnections` - Google credentials for API calls

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 2630b24 | feat | Create review approval component and API |
| cc24883 | feat | Create photo upload component and API |
| 5c826a8 | feat | Create post content form and integrate actions |

## Deviations from Plan

None - plan executed exactly as written.

## Technical Notes

### Modal System
- Uses fixed positioning with overlay backdrop
- Body scroll lock when modal open
- Escape key handler for closing
- Reload modal content on open

### Multipart Upload
- Uses native `FormData` API
- Validates file type and size client-side
- Server validates with `validateImage` for dimensions and blur

### Action Status Cards
- Fetch counts/status on dashboard load
- Refresh after closing modals
- Show at-a-glance status for owner

## Files Changed

```
src/views/dashboard/
  review-approval.ts (new)    - Review approval component
  photo-upload.ts (new)       - Photo upload component
  post-content.ts (new)       - Post content component
  main.ts (modified)          - Actions section integration

src/routes/api/
  dashboard.ts (modified)     - 6 new API endpoints
```

## Next Phase Readiness

**Blockers:** None

**Ready for:**
- 09-08: Main Dashboard Integration (final wave)

**Outstanding:**
- Notification preferences integration for dashboard actions
- Real-time SSE updates for action status changes
