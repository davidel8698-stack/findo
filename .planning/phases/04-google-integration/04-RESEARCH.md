# Phase 4: Google Integration - Research

**Researched:** 2026-01-28
**Domain:** Google Business Profile API, OAuth 2.0, Cloud Pub/Sub
**Confidence:** MEDIUM

## Summary

Google Business Profile (GBP) API provides comprehensive access to business profile data including reviews. The API requires OAuth 2.0 with the `business.manage` scope and is free with 300 QPM default quota. Unlike Meta's webhook-based approach, Google offers Cloud Pub/Sub notifications for new reviews via the My Business Notifications API. However, community reports indicate reliability issues with these notifications, making polling a necessary fallback strategy.

Key findings:
- **OAuth flow:** Use `googleapis` npm package with offline access for refresh tokens
- **Reviews:** Read via `accounts.locations.reviews.list`, reply via `reviews.updateReply`
- **Notifications:** Cloud Pub/Sub available but unreliable for some users; implement polling as primary with Pub/Sub as optimization
- **Token refresh:** Proactive refresh recommended; ~1% unexplained revocations matches Google's documented edge cases

**Primary recommendation:** Implement OAuth flow with token vault storage, use hourly polling for reviews with Cloud Pub/Sub as an optional enhancement. Proactive token refresh 5 minutes before expiry using existing token vault infrastructure.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `googleapis` | ^170.x | Google API client | Official Google-maintained Node.js client, auto-refresh built in |
| `@google-cloud/pubsub` | ^4.x | Cloud Pub/Sub | Official client for notification subscriptions |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `google-auth-library` | ^9.x | Auth utilities | Included with googleapis, handles OAuth2 flows |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| googleapis | Raw HTTP | googleapis handles token refresh automatically; raw HTTP requires manual implementation |
| Cloud Pub/Sub | Polling only | Pub/Sub reduces API calls but has reliability issues; polling is simpler and guaranteed |

**Installation:**
```bash
npm install googleapis @google-cloud/pubsub
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── services/
│   ├── google/
│   │   ├── oauth.ts           # OAuth flow, token exchange
│   │   ├── reviews.ts         # Review listing, reply posting
│   │   └── notifications.ts   # Pub/Sub subscription (optional)
│   └── token-vault.ts         # Existing, add Google provider support
├── workers/
│   ├── google-review-poller.ts    # Scheduled hourly polling
│   └── google-token-refresh.ts    # Proactive token refresh
├── routes/
│   └── google/
│       └── oauth-callback.ts  # OAuth redirect handler
└── db/schema/
    └── google-connections.ts  # GBP account metadata
```

### Pattern 1: OAuth Flow with Offline Access
**What:** Request offline access to get refresh token on first authorization
**When to use:** Always - enables background API access without user presence

```typescript
// Source: https://developers.google.com/identity/protocols/oauth2/web-server
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',  // REQUIRED for refresh token
  scope: ['https://www.googleapis.com/auth/business.manage'],
  prompt: 'consent',  // Force consent to always get refresh token
});

// After callback, exchange code for tokens
const { tokens } = await oauth2Client.getToken(code);
// tokens.refresh_token only provided on first auth or when prompt: 'consent'
// tokens.access_token expires in ~1 hour
// tokens.expiry_date is Unix timestamp in milliseconds
```

### Pattern 2: Token Refresh with Event Listener
**What:** Listen for token refresh events to update stored tokens
**When to use:** When making API calls that might trigger auto-refresh

```typescript
// Source: https://github.com/googleapis/google-api-nodejs-client
oauth2Client.on('tokens', async (tokens) => {
  // Access token was refreshed - update storage
  await tokenVaultService.storeToken(
    tenantId,
    'google',
    'access_token',
    {
      value: tokens.access_token!,
      expiresAt: new Date(tokens.expiry_date!),
      identifier: accountId
    }
  );

  // Refresh token only provided on re-consent
  if (tokens.refresh_token) {
    await tokenVaultService.storeToken(
      tenantId,
      'google',
      'refresh_token',
      {
        value: tokens.refresh_token,
        identifier: accountId
      }
    );
  }
});
```

### Pattern 3: Review Polling with Batch Endpoint
**What:** Use batch endpoint to fetch reviews across multiple locations efficiently
**When to use:** Multi-location businesses or multi-tenant polling

```typescript
// Source: https://developers.google.com/my-business/content/review-data
// Single location
const reviews = await mybusiness.accounts.locations.reviews.list({
  parent: `accounts/${accountId}/locations/${locationId}`,
  pageSize: 50,
  orderBy: 'updateTime desc'
});

// Multiple locations (batch) - reduces API calls
const batchReviews = await mybusiness.accounts.locations.batchGetReviews({
  name: `accounts/${accountId}`,
  requestBody: {
    locationNames: locationIds.map(id => `accounts/${accountId}/locations/${id}`),
    pageSize: 50,
    orderBy: 'updateTime desc',
    ignoreRatingOnlyReviews: false
  }
});
```

### Pattern 4: Reply to Review
**What:** Post owner reply to a review
**When to use:** Auto-reply to positive reviews, posting approved replies to negative

```typescript
// Source: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/updateReply
const reply = await mybusiness.accounts.locations.reviews.updateReply({
  name: `accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
  requestBody: {
    comment: replyText  // Max 4096 bytes
  }
});
```

### Anti-Patterns to Avoid

- **No offline access:** Requesting only online access means no refresh token; API access stops when user leaves
- **Ignoring token refresh events:** googleapis auto-refreshes, but you must persist updated tokens via the 'tokens' event
- **Polling too frequently:** 300 QPM shared across all endpoints; hourly polling per tenant is sufficient for review use cases
- **Not handling token revocation:** ~1%/month tokens revoke unexpectedly; must handle `invalid_grant` errors gracefully
- **Single refresh token assumption:** Limit of 50 refresh tokens per Google Account per OAuth client ID; oldest is silently revoked when exceeded

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OAuth flow | Custom HTTP token exchange | `googleapis` OAuth2Client | Handles PKCE, refresh, expiry automatically |
| Token refresh | Manual refresh before expiry | `googleapis` auto-refresh | Built-in, tested, handles edge cases |
| API rate limiting | Custom rate limiter | Exponential backoff | Google's recommended approach, handles 429s |
| Pub/Sub subscription | Custom polling of Pub/Sub | `@google-cloud/pubsub` client | Handles streaming, acks, reconnection |

**Key insight:** The googleapis library handles 80% of complexity (token refresh, error retry, JSON parsing). Fighting it creates bugs.

## Common Pitfalls

### Pitfall 1: Missing Refresh Token on Re-authorization
**What goes wrong:** User re-authorizes but no refresh token received; old refresh token may be invalid
**Why it happens:** Google only sends refresh_token on first authorization unless `prompt: 'consent'` is set
**How to avoid:** Always include `prompt: 'consent'` in authorization URL for re-connections
**Warning signs:** `tokens.refresh_token` is undefined after code exchange

### Pitfall 2: Silent Token Revocation
**What goes wrong:** API calls fail with `invalid_grant` for random tenants
**Why it happens:** Multiple causes: user revoked in Google settings, 6-month inactivity, password change, 50-token limit exceeded
**How to avoid:**
  - Handle `invalid_grant` errors by marking token invalid and prompting re-auth
  - Implement proactive token health checks (daily validation job)
  - Track last_used_at to identify inactive tokens
**Warning signs:** Sporadic 401s affecting only some tenants

### Pitfall 3: Pub/Sub Notifications Not Arriving
**What goes wrong:** Cloud Pub/Sub configured but no notifications received for new reviews
**Why it happens:** Known reliability issues reported by developers; may be related to account type or region
**How to avoid:**
  - Implement polling as primary mechanism
  - Use Pub/Sub as optimization to reduce polling frequency when working
  - Don't depend solely on Pub/Sub for review detection
**Warning signs:** New reviews appear in dashboard but no Pub/Sub message received

### Pitfall 4: Testing Mode Token Expiry
**What goes wrong:** Refresh tokens expire after 7 days during development
**Why it happens:** OAuth consent screen in "Testing" mode has 7-day token expiry limit
**How to avoid:** Submit for verification before extensive testing; use test accounts you control
**Warning signs:** `Token has been expired or revoked` after exactly 7 days

### Pitfall 5: Rate Limit During Bulk Operations
**What goes wrong:** 429 errors during polling across many tenants
**Why it happens:** 300 QPM limit is per-project, shared across all tenants
**How to avoid:**
  - Spread polling across time (not all at :00)
  - Use batch endpoints where available
  - Implement client-side rate limiting (e.g., 4 requests/second max)
  - Exponential backoff on 429s
**Warning signs:** Increasing 429 responses as tenant count grows

### Pitfall 6: GBP API Access Not Enabled
**What goes wrong:** API calls fail even with valid OAuth tokens
**Why it happens:** Must request access via GBP API contact form; takes 3-5 days
**How to avoid:** Request API access during project setup, before development begins
**Warning signs:** 0 QPM quota in Cloud Console, permission errors

## Code Examples

Verified patterns from official sources:

### Complete OAuth Flow
```typescript
// Source: https://developers.google.com/my-business/content/implement-oauth
import { google } from 'googleapis';
import { tokenVaultService } from '../services/token-vault';

export class GoogleOAuthService {
  private oauth2Client: ReturnType<typeof google.auth.OAuth2>;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  getAuthUrl(state: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/business.manage'],
      prompt: 'consent',
      state,  // Include tenant ID for callback
    });
  }

  async handleCallback(code: string, tenantId: string): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(code);

    // Store access token with expiry
    await tokenVaultService.storeToken(
      tenantId,
      'google',
      'access_token',
      {
        value: tokens.access_token!,
        expiresAt: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : new Date(Date.now() + 3600000),  // Default 1 hour
      }
    );

    // Store refresh token (never expires unless revoked)
    if (tokens.refresh_token) {
      await tokenVaultService.storeToken(
        tenantId,
        'google',
        'refresh_token',
        { value: tokens.refresh_token }
      );
    }
  }
}
```

### Proactive Token Refresh Worker
```typescript
// Source: Pattern based on token vault findExpiringTokens method
import { tokenVaultService } from '../services/token-vault';
import { google } from 'googleapis';

export async function refreshExpiringGoogleTokens(): Promise<void> {
  // Find tokens expiring in next 10 minutes
  const expiring = await tokenVaultService.findExpiringTokens(10, 'google');

  for (const entry of expiring) {
    try {
      const refreshToken = await tokenVaultService.getRefreshToken(
        entry.tenantId,
        'google'
      );

      if (!refreshToken) {
        console.log(`No refresh token for tenant ${entry.tenantId}`);
        continue;
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken.value
      });

      // Force refresh
      const { credentials } = await oauth2Client.refreshAccessToken();

      await tokenVaultService.storeToken(
        entry.tenantId,
        'google',
        'access_token',
        {
          value: credentials.access_token!,
          expiresAt: new Date(credentials.expiry_date!),
        }
      );

      console.log(`Refreshed token for tenant ${entry.tenantId}`);
    } catch (error: any) {
      if (error.message?.includes('invalid_grant')) {
        // Token was revoked - mark as invalid
        await tokenVaultService.markTokenInvalid(
          entry.tenantId,
          `Google token revoked: ${error.message}`
        );
      }
      console.error(`Failed to refresh token for ${entry.tenantId}:`, error);
    }
  }
}
```

### Review Polling Worker
```typescript
// Source: https://developers.google.com/my-business/content/review-data
import { google } from 'googleapis';
import { tokenVaultService } from '../services/token-vault';

export async function pollReviewsForTenant(
  tenantId: string,
  locationId: string,
  accountId: string
): Promise<Review[]> {
  const accessToken = await tokenVaultService.getAccessToken(
    tenantId,
    'google',
    accountId,
    5  // 5 min refresh buffer
  );

  if (!accessToken) {
    throw new Error('No valid Google token');
  }

  if (accessToken.needsRefresh) {
    // Trigger proactive refresh in background
    await refreshExpiringGoogleTokens();
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken.token.value
  });

  // Listen for automatic refreshes
  oauth2Client.on('tokens', async (tokens) => {
    await tokenVaultService.storeToken(
      tenantId,
      'google',
      'access_token',
      {
        value: tokens.access_token!,
        expiresAt: new Date(tokens.expiry_date!),
        identifier: accountId
      }
    );
  });

  const mybusiness = google.mybusinessbusinessinformation({
    version: 'v1',
    auth: oauth2Client
  });

  const response = await mybusiness.accounts.locations.reviews.list({
    parent: `accounts/${accountId}/locations/${locationId}`,
    pageSize: 50,
    orderBy: 'updateTime desc'
  });

  return response.data.reviews || [];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `plus.business.manage` scope | `business.manage` scope | 2023+ | Old scope deprecated, use new |
| Google My Business API v4 | Business Profile APIs (8 separate APIs) | 2022+ | Must enable all 8 APIs individually |
| accounts.updateNotifications | My Business Notifications API v1 | 2024+ | Old endpoint deprecated |
| Q&A notifications via Pub/Sub | Deprecated | Nov 2025 | NEW_QUESTION, UPDATED_QUESTION etc no longer work |

**Deprecated/outdated:**
- `plus.business.manage` scope: Still works for backward compatibility but use `business.manage`
- Q&A notification types: Deprecated as of November 2025; use manual polling if needed
- `accounts.updateNotifications`: Use My Business Notifications API v1 endpoint instead

## Multi-Tenant Polling Optimization

### Strategy: Staggered Polling with Rate Protection

```typescript
// Source: Based on community best practices
interface PollingConfig {
  maxQPM: number;           // 300 default
  tenantsPerBatch: number;  // Process this many before pausing
  delayBetweenBatches: number; // ms to wait between batches
}

const config: PollingConfig = {
  maxQPM: 300,
  tenantsPerBatch: 10,    // ~10 requests per batch
  delayBetweenBatches: 2000  // 2 seconds = ~300/min safe
};

async function pollAllTenants(tenants: string[]): Promise<void> {
  for (let i = 0; i < tenants.length; i += config.tenantsPerBatch) {
    const batch = tenants.slice(i, i + config.tenantsPerBatch);

    await Promise.all(batch.map(t => pollReviewsForTenant(t)));

    if (i + config.tenantsPerBatch < tenants.length) {
      await sleep(config.delayBetweenBatches);
    }
  }
}
```

### Scaling Considerations

| Tenant Count | Hourly Polls | QPM Usage | Strategy |
|--------------|--------------|-----------|----------|
| 1-50 | 50 | ~1 | No optimization needed |
| 50-200 | 200 | ~3 | Spread across hour |
| 200-500 | 500 | ~8 | Stagger + batch endpoints |
| 500+ | 500+ | 8+ | Request quota increase or prioritize active tenants |

**Recommendation:** Poll at randomized offsets within the hour to avoid thundering herd:

```typescript
// Each tenant polls at a random minute offset
const pollMinuteOffset = hash(tenantId) % 60;
// Schedule job for :pollMinuteOffset every hour
```

## Israeli/Hebrew Considerations

### Hebrew Review Text
- Reviews may contain Hebrew (RTL text)
- Review `comment` field supports Unicode including Hebrew
- Reply `comment` also supports Hebrew (max 4096 bytes, Hebrew chars = 2-3 bytes each)

### Timezone
- Use `Asia/Jerusalem` for all scheduling (already standard from Phase 1)
- Review timestamps are UTC; convert for display

### Business Hours
- Israeli businesses: Sunday-Thursday typical
- Consider polling frequency during Israeli business hours only for non-urgent use cases

## Open Questions

Things that couldn't be fully resolved:

1. **Cloud Pub/Sub Reliability for Reviews**
   - What we know: Some developers report notifications not arriving
   - What's unclear: Whether this is account-type specific, regional, or sporadic
   - Recommendation: Implement polling as primary; Pub/Sub as enhancement (Phase 8 optimization)

2. **Multi-Location Token Management**
   - What we know: One OAuth grants access to all locations the user manages
   - What's unclear: How to handle users with many GBP locations (50+ limit concern)
   - Recommendation: Store accountId as identifier; one token pair per account, not per location

3. **Token Revocation Rate**
   - What we know: ~1%/month unexplained revocations reported
   - What's unclear: Exact breakdown of causes
   - Recommendation: Implement daily token validation job; track revocation rates in production

## Sources

### Primary (HIGH confidence)
- [Google Business Profile OAuth Implementation](https://developers.google.com/my-business/content/implement-oauth) - OAuth flow, scopes
- [GBP API Quotas and Limits](https://developers.google.com/my-business/content/limits) - 300 QPM, 10 edits/min
- [Review Data API](https://developers.google.com/my-business/content/review-data) - Review listing, reply endpoints
- [googleapis npm package](https://www.npmjs.com/package/googleapis) - Official Node.js client
- [googleapis GitHub](https://github.com/googleapis/google-api-nodejs-client) - Token refresh handling

### Secondary (MEDIUM confidence)
- [My Business Notifications API](https://developers.google.com/my-business/content/notification-setup) - Cloud Pub/Sub setup
- [NotificationSetting Reference](https://developers.google.com/my-business/reference/notifications/rest/v1/NotificationSetting) - Notification types
- [GBP API Prerequisites](https://developers.google.com/my-business/content/prereqs) - Access request process
- [OAuth 2.0 Token Expiration](https://developers.google.com/identity/protocols/oauth2) - Refresh token lifecycle

### Tertiary (LOW confidence - needs validation)
- Community reports on Pub/Sub reliability issues via Google Developer forums
- Token revocation rate estimates from community discussions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Google documentation and npm packages
- Architecture: MEDIUM - Patterns derived from docs + community best practices
- Pitfalls: MEDIUM - Mix of official docs and community reports
- Multi-tenant polling: MEDIUM - Calculated from quota limits, not tested at scale

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (Google APIs stable, 30-day validity)

---

## Appendix: Required Environment Variables

```bash
# Google OAuth (Cloud Console > APIs & Services > Credentials)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://app.findo.co.il/api/google/callback

# Optional: For Cloud Pub/Sub notifications
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_PUBSUB_TOPIC=projects/your-project/topics/gbp-notifications
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

## Appendix: GBP API Access Checklist

1. [ ] Create Google Cloud Project
2. [ ] Request GBP API access via contact form (3-5 days)
3. [ ] Verify 300 QPM quota in Cloud Console
4. [ ] Enable all 8 Business Profile APIs
5. [ ] Configure OAuth consent screen
6. [ ] Create OAuth 2.0 Client ID (Web application)
7. [ ] Add authorized redirect URIs
8. [ ] Submit for OAuth verification (if sensitive scopes)
