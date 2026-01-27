import 'dotenv/config';
import { db } from '../src/db/index';
import { tenants } from '../src/db/schema/index';
import { tokenVaultService } from '../src/services/token-vault';
import { sql } from 'drizzle-orm';

/**
 * Seed two test tenants for Phase 1 verification.
 * These tenants will be used to verify:
 * - Multi-tenant architecture works
 * - RLS prevents cross-tenant access
 * - Token vault encryption works
 */
async function seedTestTenants() {
  console.log('Seeding test tenants...');

  // Clear existing test tenants (for re-running)
  await db.delete(tenants).where(
    sql`owner_email LIKE '%@test.findo.local'`
  );
  console.log('Cleared existing test tenants');

  // Create Tenant A
  const [tenantA] = await db
    .insert(tenants)
    .values({
      businessName: 'Test Business A',
      businessType: 'Restaurant',
      ownerName: 'Test Owner A',
      ownerEmail: 'owner-a@test.findo.local',
      ownerPhone: '+972501234567',
      address: 'Tel Aviv, Israel',
      status: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      timezone: 'Asia/Jerusalem',
    })
    .returning();

  console.log(`Created Tenant A: ${tenantA.id}`);
  console.log(`  Business: ${tenantA.businessName}`);
  console.log(`  Owner: ${tenantA.ownerName} (${tenantA.ownerEmail})`);

  // Create Tenant B
  const [tenantB] = await db
    .insert(tenants)
    .values({
      businessName: 'Test Business B',
      businessType: 'Plumber',
      ownerName: 'Test Owner B',
      ownerEmail: 'owner-b@test.findo.local',
      ownerPhone: '+972509876543',
      address: 'Jerusalem, Israel',
      status: 'active',
      timezone: 'Asia/Jerusalem',
    })
    .returning();

  console.log(`Created Tenant B: ${tenantB.id}`);
  console.log(`  Business: ${tenantB.businessName}`);
  console.log(`  Owner: ${tenantB.ownerName} (${tenantB.ownerEmail})`);

  // Store test tokens for both tenants
  console.log('\nStoring test tokens...');

  // Tenant A: WhatsApp tokens
  await tokenVaultService.storeToken(tenantA.id, 'whatsapp', 'access_token', {
    value: 'test-whatsapp-token-tenant-a',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    identifier: 'waba-12345',
  });
  console.log('  Stored WhatsApp access token for Tenant A');

  // Tenant B: Google tokens
  await tokenVaultService.storeToken(tenantB.id, 'google', 'access_token', {
    value: 'test-google-token-tenant-b',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    identifier: 'gbp-67890',
  });
  await tokenVaultService.storeToken(tenantB.id, 'google', 'refresh_token', {
    value: 'test-google-refresh-token-tenant-b',
    identifier: 'gbp-67890',
  });
  console.log('  Stored Google tokens for Tenant B');

  console.log('\n=== Test Tenants Seeded ===');
  console.log(`Tenant A ID: ${tenantA.id}`);
  console.log(`Tenant B ID: ${tenantB.id}`);
  console.log('\nUse these IDs in X-Tenant-ID header for testing.');

  // Return IDs for use in verification script
  return {
    tenantA: tenantA.id,
    tenantB: tenantB.id,
  };
}

// Run if executed directly
seedTestTenants()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding tenants:', error);
    process.exit(1);
  });

export { seedTestTenants };
