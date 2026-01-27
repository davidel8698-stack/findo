import 'dotenv/config';
import { db } from '../src/db/index';
import { tenants, activityEvents, tokenVault } from '../src/db/schema/index';
import { tokenVaultService } from '../src/services/token-vault';
import { setTenantContext, clearTenantContext } from '../src/middleware/tenant-context';
import { eq, sql } from 'drizzle-orm';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

interface VerificationResult {
  criterion: string;
  passed: boolean;
  details: string;
}

const results: VerificationResult[] = [];

function log(criterion: string, passed: boolean, details: string) {
  results.push({ criterion, passed, details });
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`${status}: ${criterion}`);
  console.log(`  ${details}`);
}

/**
 * Criterion 1: Webhook processes and returns 200 within 500ms
 */
async function verifyWebhook(tenantId: string) {
  console.log('\n=== Criterion 1: Webhook Processing ===');

  const start = Date.now();
  const response = await fetch(`${BASE_URL}/webhook/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantId,
    },
    body: JSON.stringify({
      event_id: `verify-${Date.now()}`,
      test_data: 'Phase 1 verification',
    }),
  });
  const elapsed = Date.now() - start;

  const data = await response.json();

  log(
    'Webhook returns 200',
    response.status === 200,
    `Status: ${response.status}, Response: ${JSON.stringify(data)}`
  );

  log(
    'Webhook responds within 500ms',
    elapsed < 500,
    `Response time: ${elapsed}ms`
  );

  // Wait for job to process
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check activity event was created
  await setTenantContext(tenantId);
  const events = await db.query.activityEvents.findMany({
    where: eq(activityEvents.tenantId, tenantId),
    orderBy: (events, { desc }) => [desc(events.createdAt)],
    limit: 1,
  });
  await clearTenantContext();

  log(
    'Webhook job queued and processed asynchronously',
    events.length > 0 && events[0].eventType === 'webhook.test',
    `Activity events found: ${events.length}, Latest type: ${events[0]?.eventType || 'none'}`
  );
}

/**
 * Criterion 2: Two test tenants with RLS isolation
 */
async function verifyRLSIsolation(tenantAId: string, tenantBId: string) {
  console.log('\n=== Criterion 2: RLS Tenant Isolation ===');

  // Verify tenants exist
  const tenantA = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantAId),
  });
  const tenantB = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantBId),
  });

  log(
    'Two test tenants exist',
    !!tenantA && !!tenantB,
    `Tenant A: ${tenantA?.businessName || 'NOT FOUND'}, Tenant B: ${tenantB?.businessName || 'NOT FOUND'}`
  );

  // Create activity event for Tenant A
  await setTenantContext(tenantAId);
  await db.insert(activityEvents).values({
    tenantId: tenantAId,
    eventType: 'test.rls',
    title: 'RLS Test Event A',
    source: 'verify-script',
  });

  // Try to query from Tenant A context - should see Tenant A events only
  const eventsFromA = await db.query.activityEvents.findMany({
    where: eq(activityEvents.eventType, 'test.rls'),
  });
  await clearTenantContext();

  // Create activity event for Tenant B
  await setTenantContext(tenantBId);
  await db.insert(activityEvents).values({
    tenantId: tenantBId,
    eventType: 'test.rls',
    title: 'RLS Test Event B',
    source: 'verify-script',
  });

  // Query from Tenant B context - should NOT see Tenant A events
  const eventsFromB = await db.query.activityEvents.findMany({
    where: eq(activityEvents.eventType, 'test.rls'),
  });
  await clearTenantContext();

  // Tenant A should only see 1 event (their own)
  const tenantASeesTenantB = eventsFromA.some((e) => e.tenantId === tenantBId);
  const tenantBSeesTenantA = eventsFromB.some((e) => e.tenantId === tenantAId);

  log(
    'RLS prevents Tenant A from seeing Tenant B data',
    !tenantASeesTenantB,
    `Tenant A query found ${eventsFromA.length} events, cross-tenant: ${tenantASeesTenantB}`
  );

  log(
    'RLS prevents Tenant B from seeing Tenant A data',
    !tenantBSeesTenantA,
    `Tenant B query found ${eventsFromB.length} events, cross-tenant: ${tenantBSeesTenantA}`
  );
}

/**
 * Criterion 3: Encrypted token storage
 */
async function verifyTokenEncryption(tenantId: string) {
  console.log('\n=== Criterion 3: Encrypted Token Storage ===');

  const testToken = 'super-secret-test-token-12345';

  // Store token
  await tokenVaultService.storeToken(tenantId, 'voicenter', 'api_key', {
    value: testToken,
  });

  // Verify encrypted in database (direct query, no decryption)
  const rawEntry = await db.query.tokenVault.findFirst({
    where: eq(tokenVault.tenantId, tenantId),
  });

  const encryptedDoesNotContainPlaintext =
    rawEntry && !rawEntry.encryptedValue.includes(testToken);

  log(
    'Tokens encrypted before storage (plaintext not in DB)',
    !!encryptedDoesNotContainPlaintext,
    `Stored value starts with: ${rawEntry?.encryptedValue.substring(0, 50)}...`
  );

  // Retrieve and verify decryption works
  const retrieved = await tokenVaultService.getToken(tenantId, 'voicenter', 'api_key');

  log(
    'Tokens decrypted on retrieval',
    retrieved?.value === testToken,
    `Retrieved value matches original: ${retrieved?.value === testToken}`
  );
}

/**
 * Criterion 4: Background job scheduler
 */
async function verifyScheduler() {
  console.log('\n=== Criterion 4: Background Job Scheduler ===');

  // Check scheduled jobs via BullMQ
  const { scheduledQueue } = await import('../src/queue/index');
  const repeatableJobs = await scheduledQueue.getRepeatableJobs();

  const hasHourly = repeatableJobs.some((j) => j.name.includes('hourly') || j.pattern === '0 * * * *');
  const hasDaily = repeatableJobs.some((j) => j.name.includes('daily') || j.pattern === '0 10 * * *');
  const hasWeekly = repeatableJobs.some((j) => j.name.includes('weekly') || j.pattern === '0 10 * * 0');

  log(
    'Hourly job scheduled',
    hasHourly,
    `Found hourly jobs: ${repeatableJobs.filter((j) => j.pattern?.includes('* * * *')).map((j) => j.name).join(', ') || 'none'}`
  );

  log(
    'Daily job scheduled',
    hasDaily,
    `Found daily jobs: ${repeatableJobs.filter((j) => j.name.includes('daily') || j.name.includes('digest')).map((j) => j.name).join(', ') || 'none'}`
  );

  log(
    'Weekly job scheduled',
    hasWeekly,
    `Found weekly jobs: ${repeatableJobs.filter((j) => j.name.includes('weekly') || j.name.includes('photo')).map((j) => j.name).join(', ') || 'none'}`
  );

  console.log('\n  All scheduled jobs:');
  for (const job of repeatableJobs) {
    console.log(`    - ${job.name}: ${job.pattern} (next: ${new Date(job.next).toLocaleString()})`);
  }
}

/**
 * Criterion 5: Activity feed real-time updates
 */
async function verifyActivityFeed(tenantId: string) {
  console.log('\n=== Criterion 5: Activity Feed Real-time ===');

  // Create an activity event via service
  const { activityService } = await import('../src/services/activity');

  await setTenantContext(tenantId);
  const event = await activityService.createAndPublish(tenantId, {
    eventType: 'test.realtime',
    title: 'Real-time Test Event',
    description: 'Testing activity feed',
    source: 'verify-script',
  });
  await clearTenantContext();

  log(
    'Activity event created',
    !!event.id,
    `Event ID: ${event.id}, Type: ${event.eventType}`
  );

  // Verify event can be queried via API
  const response = await fetch(`${BASE_URL}/api/activity/recent?count=5`, {
    headers: {
      'X-Tenant-ID': tenantId,
    },
  });

  const data = await response.json();
  const hasRealtimeEvent = data.events?.some((e: { eventType: string }) => e.eventType === 'test.realtime');

  log(
    'Activity feed receives real-time updates',
    response.status === 200 && hasRealtimeEvent,
    `API returned ${data.events?.length || 0} events, includes test event: ${hasRealtimeEvent}`
  );
}

/**
 * Run all verifications
 */
async function runVerification() {
  console.log('========================================');
  console.log('  PHASE 1 VERIFICATION');
  console.log('========================================');
  console.log(`Testing against: ${BASE_URL}`);

  // Get test tenant IDs
  const testTenants = await db.query.tenants.findMany({
    where: sql`owner_email LIKE '%@test.findo.local'`,
    limit: 2,
  });

  if (testTenants.length < 2) {
    console.error('\nERROR: Test tenants not found. Run: pnpm seed:test');
    process.exit(1);
  }

  const tenantAId = testTenants[0].id;
  const tenantBId = testTenants[1].id;

  console.log(`\nUsing test tenants:`);
  console.log(`  Tenant A: ${tenantAId} (${testTenants[0].businessName})`);
  console.log(`  Tenant B: ${tenantBId} (${testTenants[1].businessName})`);

  // Run all criteria checks
  await verifyWebhook(tenantAId);
  await verifyRLSIsolation(tenantAId, tenantBId);
  await verifyTokenEncryption(tenantAId);
  await verifyScheduler();
  await verifyActivityFeed(tenantAId);

  // Summary
  console.log('\n========================================');
  console.log('  VERIFICATION SUMMARY');
  console.log('========================================');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`\nTotal: ${results.length} checks`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFAILED CHECKS:');
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`  - ${r.criterion}: ${r.details}`);
    }
  }

  const allPassed = failed === 0;
  console.log(`\n${allPassed ? 'PHASE 1 COMPLETE' : 'PHASE 1 INCOMPLETE'}`);

  process.exit(allPassed ? 0 : 1);
}

// Run verification
runVerification().catch((error) => {
  console.error('Verification failed with error:', error);
  process.exit(1);
});
