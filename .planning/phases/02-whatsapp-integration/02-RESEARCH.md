# Phase 02: WhatsApp Integration - Research

**Researched:** 2026-01-27
**Domain:** WhatsApp Business API (Meta Cloud API)
**Confidence:** MEDIUM (Meta docs not directly fetchable; verified via multiple secondary sources)

## Summary

WhatsApp Business API integration uses Meta's Cloud API with Embedded Signup for one-click connection. The phase requires implementing: (1) Meta Embedded Signup flow via Facebook JavaScript SDK, (2) secure storage of WABA ID, Phone Number ID, and System User tokens, (3) message sending via Graph API, and (4) webhook reception with signature verification.

**Critical 2026 policy change:** As of January 15, 2026, Meta banned general-purpose AI chatbots from WhatsApp Business API. Business automation (support bots, booking systems, order tracking) remains allowed. Findo's use case (business automation with AI assistance for specific tasks) is compliant as long as AI is "incidental or ancillary" rather than primary functionality.

**Primary recommendation:** Use Meta Cloud API (not On-Premises), implement Embedded Signup v2 flow, store System User tokens (never-expiring) in existing Token Vault, process webhooks through existing queue infrastructure.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Facebook JavaScript SDK | Latest | Embedded Signup popup | Official Meta SDK for OAuth/signup flows |
| Graph API | v21.0+ | WhatsApp Cloud API calls | Current stable Graph API version |
| crypto (Node.js built-in) | N/A | Webhook signature verification | HMAC-SHA256 verification |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| axios or node-fetch | Latest | Graph API HTTP calls | API requests to Meta |
| @whatsapp-cloudapi/types | Latest | TypeScript types | Type-safe webhook payloads |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct Graph API | Official WhatsApp Node.js SDK | SDK is archived/deprecated; direct API is recommended |
| Direct Graph API | Third-party SDKs (@great-detail/whatsapp) | Less control, dependency risk for production |

**Note on Official SDK:** The official WhatsApp Node.js SDK (npm: `whatsapp`) is **archived**. Meta recommends using the Graph API directly or the WhatsApp Node.js Project Template. Do not use the archived SDK for production.

**Installation:**
```bash
# No special packages needed for Cloud API
# Use existing axios/fetch for HTTP calls
# Types package is optional but recommended
npm install @whatsapp-cloudapi/types
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── services/
│   └── whatsapp/
│       ├── client.ts          # Graph API client wrapper
│       ├── embedded-signup.ts # Token exchange logic (backend)
│       ├── messages.ts        # Send message functions
│       └── webhooks.ts        # Webhook payload handlers
├── routes/
│   └── whatsapp/
│       ├── callback.ts        # Embedded Signup callback endpoint
│       └── webhook.ts         # Webhook receiver endpoint
├── queue/workers/
│   └── whatsapp-message.worker.ts  # Customer message processing
│   └── whatsapp-status.worker.ts   # Status update batch processing
└── db/schema/
    └── whatsapp-messages.ts   # Message tracking table
```

### Pattern 1: Meta Embedded Signup Flow

**What:** JavaScript SDK popup that returns WABA ID, Phone Number ID, and auth code
**When to use:** User clicks "Connect WhatsApp" button

**Frontend Flow:**
```typescript
// Load Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId: process.env.META_APP_ID,
    cookie: true,
    xfbml: true,
    version: 'v21.0'
  });
};

// Trigger Embedded Signup
function launchWhatsAppSignup() {
  FB.login((response) => {
    if (response.authResponse) {
      // Send to backend: response.authResponse.code
      // Also capture sessionInfo for waba_id and phone_number_id
    }
  }, {
    config_id: process.env.META_CONFIG_ID, // Facebook Login for Business config
    response_type: 'code',
    override_default_response_type: true,
    extras: {
      setup: {
        // Embedded Signup v2
      },
      featureType: 'only_waba_sharing', // or 'coexistence' if migrating
      sessionInfoVersion: 2
    }
  });
}
```

**Backend Token Exchange:**
```typescript
// Exchange code for long-lived access token
async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?` +
    `client_id=${META_APP_ID}&` +
    `client_secret=${META_APP_SECRET}&` +
    `code=${code}`
  );
  const { access_token } = await response.json();
  return access_token;
}
```

### Pattern 2: System User Token (Recommended for Production)

**What:** Never-expiring token tied to system user, not individual user
**When to use:** Production API calls

**Setup (Manual, One-Time in Meta Business Suite):**
1. Go to Business Settings > System Users
2. Add system user with Admin role
3. Add assets (WhatsApp accounts)
4. Generate token with permissions: `whatsapp_business_management`, `whatsapp_business_messaging`

**Storage:**
```typescript
// Store System User token in existing Token Vault
await tokenVaultService.storeToken(
  tenantId,
  'whatsapp',
  'access_token',
  {
    value: systemUserToken,
    identifier: wabaId, // WABA ID as identifier
    // No expiresAt - System User tokens don't expire
  }
);
```

### Pattern 3: Webhook Signature Verification

**What:** HMAC-SHA256 verification of X-Hub-Signature-256 header
**When to use:** Every incoming webhook

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string,
  appSecret: string
): boolean {
  const expectedSignature = 'sha256=' +
    crypto.createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

**Critical:** Must verify BEFORE parsing JSON body. Middleware like `express.json()` parses body before verification, breaking the signature check. Use raw body middleware.

### Pattern 4: Send Template Message

**What:** Send pre-approved template to initiate conversation
**When to use:** First message to customer (outside 24-hour window)

```typescript
async function sendTemplateMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  templateName: string,
  languageCode: string,
  components?: any[]
): Promise<{ messageId: string }> {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      }),
    }
  );

  const result = await response.json();
  return { messageId: result.messages[0].id };
}
```

### Pattern 5: Send Freeform Message (Within 24-Hour Window)

**What:** Send text/image without template
**When to use:** Within 24-hour customer service window after customer message

```typescript
async function sendTextMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string
): Promise<{ messageId: string }> {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: text },
      }),
    }
  );

  const result = await response.json();
  return { messageId: result.messages[0].id };
}
```

### Anti-Patterns to Avoid

- **Using archived WhatsApp Node.js SDK:** It's deprecated. Use Graph API directly.
- **Storing access tokens in frontend:** All tokens and API calls must reside in backend.
- **Skipping webhook signature verification:** Security vulnerability.
- **Sending freeform messages outside 24-hour window:** Will fail with error 131047.
- **Using temporary tokens in production:** They expire in 24 hours. Use System User tokens.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Webhook signature verification | Custom HMAC | crypto.timingSafeEqual | Timing attacks |
| Message retry with backoff | Custom retry logic | BullMQ (already implemented) | Complex edge cases |
| Rate limiting | Custom rate limiter | Meta's built-in tier system | They enforce it anyway |
| Template management UI | Custom builder | Meta Business Suite | Required for approval |

**Key insight:** Meta controls the platform. Don't fight their systems (tier limits, template approval, pricing). Build around their constraints.

## Common Pitfalls

### Pitfall 1: 24-Hour Window Confusion

**What goes wrong:** Sending freeform message after window expires, getting error 131047
**Why it happens:** Misunderstanding when window starts/resets
**How to avoid:**
- Track last customer message timestamp per conversation
- Window opens when CUSTOMER sends message (not when you send)
- Window resets with each new customer message
- After 24 hours, MUST use template
**Warning signs:** Error code 131047 in API response

### Pitfall 2: Token Type Confusion

**What goes wrong:** Using temporary token from App Dashboard in production
**Why it happens:** Quick testing works, then breaks in production
**How to avoid:**
- Always use System User tokens for production
- System User tokens don't expire
- Store in Token Vault without expiresAt
**Warning signs:** Unexpected 401 errors after ~24 hours

### Pitfall 3: Webhook Verification Order

**What goes wrong:** Signature verification fails even with correct secret
**Why it happens:** Body parsed before verification (changes bytes)
**How to avoid:**
- Get raw body BEFORE any JSON parsing
- Hono: Use `c.req.raw.text()` not `c.req.json()`
- Verify, THEN parse
**Warning signs:** Signature never matches

### Pitfall 4: Phone Number Already Registered

**What goes wrong:** Embedded Signup fails with "phone already registered"
**Why it happens:** Number is linked to personal WhatsApp or WhatsApp Business App
**How to avoid:**
- Clear guidance in UI: "This number must NOT be active on WhatsApp"
- Check eligibility before signup attempt
- Provide steps to deregister from WhatsApp app
**Warning signs:** Meta error during Embedded Signup

### Pitfall 5: Template Category Misclassification

**What goes wrong:** Utility template reclassified as Marketing (higher cost)
**Why it happens:** Meta's ML system determines intent, not your label
**How to avoid:**
- Utility templates must be factual, neutral, linked to user action
- No promotional language in utility templates
- Review Meta's category guidelines before submission
**Warning signs:** Template approved but at higher price tier

### Pitfall 6: Quality Rating Death Spiral

**What goes wrong:** Low quality rating reduces messaging limits, limits reduce engagement, rating drops further
**Why it happens:** User blocks, spam reports, low read rates
**How to avoid:**
- Strict opt-in flows (explicit WhatsApp consent, not just SMS)
- Clear unsubscribe option in every message
- Don't send promotional content to unengaged users
- Monitor quality rating weekly
**Warning signs:** Quality rating drops to "Low", tier downgrade notice

### Pitfall 7: Media Download Rate Limit

**What goes wrong:** Image downloads from webhook fail with rate limit
**Why it happens:** 5 failed requests in 1 hour blocks endpoint for 1 hour
**How to avoid:**
- Implement retry with backoff for media downloads
- Cache media locally after successful download
- Don't retry immediately on failure
**Warning signs:** 429 errors on media endpoint

## Code Examples

### Incoming Message Webhook Handler

```typescript
// src/routes/whatsapp/webhook.ts
import { Hono } from 'hono';
import crypto from 'crypto';
import { webhookQueue } from '../../queue/queues';

const whatsappWebhook = new Hono();

// Verification endpoint (GET) - Meta verifies webhook setup
whatsappWebhook.get('/', (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return c.text(challenge!, 200);
  }
  return c.text('Forbidden', 403);
});

// Message receiver (POST)
whatsappWebhook.post('/', async (c) => {
  // Get raw body for signature verification
  const rawBody = await c.req.raw.text();
  const signature = c.req.header('X-Hub-Signature-256');

  if (!signature || !verifySignature(rawBody, signature)) {
    return c.text('Invalid signature', 401);
  }

  const body = JSON.parse(rawBody);

  // Respond immediately (< 500ms)
  // Meta requires fast response, process async

  // Extract and queue messages
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field === 'messages') {
        const value = change.value;

        // Queue for async processing
        await webhookQueue.add('whatsapp-message', {
          source: 'whatsapp',
          eventId: `wa_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          eventType: value.messages ? 'message' : 'status',
          payload: value,
          receivedAt: new Date().toISOString(),
        });
      }
    }
  }

  return c.text('OK', 200);
});

function verifySignature(rawBody: string, signature: string): boolean {
  const expected = 'sha256=' +
    crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET!)
      .update(rawBody)
      .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

export { whatsappWebhook };
```

### Webhook Payload Parsing

```typescript
// src/services/whatsapp/webhooks.ts

interface WhatsAppWebhookValue {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: Array<{
    profile: { name: string };
    wa_id: string;
  }>;
  messages?: Array<{
    from: string;
    id: string;
    timestamp: string;
    type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker' | 'location' | 'contacts';
    text?: { body: string };
    image?: { id: string; mime_type: string; sha256: string; caption?: string };
    // ... other types
  }>;
  statuses?: Array<{
    id: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipient_id: string;
    errors?: Array<{ code: number; title: string }>;
  }>;
}

export function parseWebhookPayload(value: WhatsAppWebhookValue) {
  const phoneNumberId = value.metadata.phone_number_id;

  // Messages from customers
  const messages = (value.messages || []).map(msg => ({
    messageId: msg.id,
    from: msg.from,
    timestamp: new Date(parseInt(msg.timestamp) * 1000),
    type: msg.type,
    text: msg.text?.body,
    mediaId: msg.image?.id,
    contactName: value.contacts?.[0]?.profile.name,
  }));

  // Status updates for sent messages
  const statuses = (value.statuses || []).map(status => ({
    messageId: status.id,
    status: status.status,
    timestamp: new Date(parseInt(status.timestamp) * 1000),
    recipientId: status.recipient_id,
    errorCode: status.errors?.[0]?.code,
  }));

  return { phoneNumberId, messages, statuses };
}
```

### Embedded Signup Callback

```typescript
// src/routes/whatsapp/callback.ts
import { Hono } from 'hono';
import { tokenVaultService } from '../../services/token-vault';

const whatsappCallback = new Hono();

interface EmbeddedSignupData {
  code: string;           // Auth code to exchange
  wabaId: string;         // WhatsApp Business Account ID
  phoneNumberId: string;  // Phone Number ID for API calls
}

whatsappCallback.post('/embedded-signup', async (c) => {
  const { tenantId } = c.get('tenant');
  const { code, wabaId, phoneNumberId }: EmbeddedSignupData = await c.req.json();

  // Exchange code for access token
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?` +
    `client_id=${process.env.META_APP_ID}&` +
    `client_secret=${process.env.META_APP_SECRET}&` +
    `code=${code}`
  );

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json();
    return c.json({ error: 'Token exchange failed', details: error }, 400);
  }

  const { access_token } = await tokenResponse.json();

  // Store credentials in Token Vault
  // WABA ID stored as access_token identifier
  await tokenVaultService.storeToken(
    tenantId,
    'whatsapp',
    'access_token',
    {
      value: access_token,
      identifier: wabaId,
      // System User tokens don't expire; user tokens last 60 days
      // For Embedded Signup flow, tokens are short-lived initially
      // Consider exchanging for long-lived or using System User
    }
  );

  // Store Phone Number ID separately (needed for API calls)
  await tokenVaultService.storeToken(
    tenantId,
    'whatsapp',
    'api_key', // Using api_key type for Phone Number ID
    {
      value: phoneNumberId,
      identifier: wabaId,
    }
  );

  return c.json({
    success: true,
    wabaId,
    phoneNumberId: phoneNumberId.slice(-4), // Last 4 digits only for security
  });
});

export { whatsappCallback };
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| On-Premises API | Cloud API | 2022-2023 | Cloud API is now primary; On-Premises deprecated |
| Conversation-based pricing | Per-message pricing | July 1, 2025 | Simpler cost calculation, utility free in 24hr window |
| Per-number messaging limits | Portfolio-level limits | October 7, 2025 | Limits shared across all numbers in business |
| Open AI assistants allowed | General-purpose AI banned | January 15, 2026 | Business automation only; no ChatGPT-style bots |
| Embedded Signup v1 | Embedded Signup v2 | 2024 | v1 deprecated; use v2 with sessionInfoVersion: 2 |

**Deprecated/outdated:**
- WhatsApp On-Premises API: Deprecated, use Cloud API
- Official Node.js SDK (`whatsapp` npm): Archived, use Graph API directly
- Embedded Signup v1: Use v2 with sessionInfoVersion: 2

## Template Approval and Hebrew Support

### Hebrew Language Support

Hebrew (`he`) is a **supported language** for WhatsApp message templates. Templates in Hebrew follow the same approval process as other languages.

**Confidence:** MEDIUM (verified via multiple BSP documentation sources)

### Template Approval Process

1. Create template in Meta Business Suite or via API
2. Select category: Marketing, Utility, or Authentication
3. Submit for review
4. Approval typically within minutes (ML-assisted)
5. Some templates may take up to 48 hours

**Template Statuses:**
- Pending: Under review
- Approved: Ready to use
- Rejected: Violates policy or incorrect format
- Paused: Negative user feedback
- Disabled: Repeated violations

**Common Rejection Reasons:**
- Placeholder at beginning or end of message
- Too generic (could be used for spam)
- Promotional content in Utility template
- Policy violation (prohibited content)

### Template Categories and Pricing (2026)

| Category | Use Case | Price Range | Free in 24hr Window |
|----------|----------|-------------|---------------------|
| Utility | Order confirmations, receipts, updates | $0.004-$0.046 | Yes |
| Marketing | Promotions, announcements | $0.025-$0.137 | No |
| Authentication | OTPs, verification codes | $0.004-$0.046 | No |
| Service | Replies within 24hr window | Free | N/A |

**Key insight for Findo:** Use Utility templates for appointment reminders, booking confirmations. Reserve Marketing for optional promotional features.

## Phone Number Eligibility

### Requirements for Embedded Signup

1. **Not registered on WhatsApp:** Number must not be active on personal WhatsApp or WhatsApp Business App
2. **Can receive SMS or voice calls:** For OTP verification during signup
3. **Not IVR-only:** Must be able to receive OTPs
4. **Valid format:** International format without + prefix

### Coexistence Feature

If the business owner wants to use their existing WhatsApp Business App number:
- "Coexistence" mode allows migrating number while preserving chat history
- User sees QR code during signup to confirm migration
- After migration, WhatsApp Business App continues to work alongside API

**Recommendation:** Support both fresh number signup and coexistence migration. Guide user based on their situation.

### Unverified Business Limitations

Without Meta Business Verification:
- 250 messages per 24-hour period limit
- Display name not verified (may show as phone number)

**Timeline for verification:** 1-14 business days typically

## Messaging Tiers

### Initial Tier (Unverified)
- 250 unique customers per 24 hours

### After Verification
- **Tier 1:** 1,000 unique customers/day
- **Tier 2:** 10,000 unique customers/day
- **Tier 3:** 100,000 unique customers/day
- **Unlimited:** Available for high-volume verified businesses

### Tier Upgrades

Automatic upgrade when:
1. Business portfolio is verified
2. Quality rating is "Medium" or "High"
3. Sent to 50%+ of current limit in past 7 days

**Warning:** If quality rating stays "Low" for 7 days, tier downgrades.

## January 2026 AI Policy Impact

### What's Banned

"AI Providers" are prohibited from "providing, delivering, offering, selling, or otherwise making available" AI technologies when "such technologies are the primary functionality."

### What's Allowed

AI that is "incidental or ancillary" to business operations:
- Customer service bots with AI assistance
- Booking/scheduling bots with AI understanding
- Order tracking with AI-generated summaries
- Lead qualification with AI scoring

### Findo Compliance Assessment

Findo's use case (automated business management assistant) is **compliant** because:
- Primary functionality is business automation (call handling, review management, scheduling)
- AI is supplementary (summarizing calls, generating responses, understanding queries)
- Bot exists to facilitate the business's core operations, not as standalone AI product

**Recommendation:** Frame WhatsApp interactions as business automation with AI assistance, not "AI chatbot."

## Open Questions

1. **Exact Facebook Login for Business configuration**
   - What we know: Need config_id from Meta App Dashboard
   - What's unclear: Exact permissions and scopes to request
   - Recommendation: Create app in Meta Developer Console during implementation, document exact steps

2. **System User Token vs User Token for Embedded Signup**
   - What we know: System User tokens are better for production (never expire)
   - What's unclear: Can Embedded Signup directly issue System User tokens?
   - Recommendation: Use Embedded Signup for initial connection, then guide user to create System User token for production

3. **Webhook retry behavior**
   - What we know: Meta expects 200 OK response
   - What's unclear: Exact retry timing and max attempts from Meta's side
   - Recommendation: Always respond 200 OK quickly, handle failures in queue

## Sources

### Primary (HIGH confidence)
- Multiple BSP documentation (Infobip, Twilio, 360dialog) - consistently describe same API patterns
- Postman WhatsApp Cloud API collection (official Meta) - API endpoints and structure
- TechCrunch/industry news - January 2026 AI policy changes

### Secondary (MEDIUM confidence)
- Community tutorials and blog posts (cross-verified with multiple sources)
- GitHub repositories implementing Embedded Signup
- npm package documentation (@whatsapp-cloudapi/types)

### Tertiary (LOW confidence)
- Individual blog posts about specific implementation details
- Stack Overflow answers about edge cases

**Note:** Official Meta developers.facebook.com documentation could not be directly fetched. Research relied on secondary sources that cite official docs. Implementation should verify against official docs.

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - Official SDK archived, Graph API pattern consistent across sources
- Architecture: HIGH - Clear patterns across multiple implementations
- Pitfalls: HIGH - Well-documented across BSP docs and community
- Template/Hebrew: MEDIUM - Consistent across sources but not directly verified
- 2026 AI policy: HIGH - Multiple news sources and official announcement

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - API is stable, policy recently changed)

---

## Integration with Existing Foundation

### Token Vault Compatibility

Existing Token Vault schema supports WhatsApp:
- `provider: 'whatsapp'` already defined in enum
- `identifier` field can store WABA ID
- Encryption with AES-256-GCM already implemented
- `isValid` tracking supports daily validation requirement

### Queue Infrastructure Compatibility

Existing queues support WhatsApp:
- `webhookQueue` already accepts `source: 'whatsapp'`
- Can add new queues for message/status processing
- BullMQ backoff aligns with retry requirements

### New Infrastructure Needed

1. **WhatsApp-specific database tables:**
   - `whatsapp_connections` - WABA ID, Phone Number ID, connection status
   - `whatsapp_messages` - Message tracking (sent, delivered, read)
   - `whatsapp_conversations` - 24-hour window tracking

2. **Additional queues:**
   - Customer message processing queue
   - Status update batch processing queue

3. **Environment variables:**
   - `META_APP_ID`
   - `META_APP_SECRET`
   - `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
   - `META_CONFIG_ID` (Facebook Login for Business configuration)
