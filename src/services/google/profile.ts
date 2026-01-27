import { google } from 'googleapis';
import { createAuthenticatedClient } from './oauth';

/**
 * Business Profile types for clean consumption
 */
export interface BusinessProfile {
  accountId: string;
  accountName: string;
  locations: LocationInfo[];
}

export interface LocationInfo {
  locationId: string;
  name: string;          // Full resource name: accounts/{accountId}/locations/{locationId}
  title: string;         // Business display name
  address?: string;      // Formatted address
  primaryPhone?: string;
  websiteUri?: string;
}

/**
 * Get list of locations for a tenant's GBP account.
 *
 * Uses mybusinessbusinessinformation API for location details.
 * readMask specifies which fields to return (reduces payload).
 *
 * @param tenantId - Tenant UUID
 * @param accountId - Google Business Profile account ID
 * @returns List of locations for the account
 */
export async function getLocations(
  tenantId: string,
  accountId: string
): Promise<LocationInfo[]> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const businessInfo = google.mybusinessbusinessinformation({
    version: 'v1',
    auth: client,
  });

  const response = await businessInfo.accounts.locations.list({
    parent: `accounts/${accountId}`,
    readMask: 'name,title,storefrontAddress,phoneNumbers,websiteUri',
  });

  const locations = response.data.locations || [];

  return locations.map((loc) => ({
    locationId: loc.name?.split('/').pop() || '',
    name: loc.name || '',
    title: loc.title || '',
    address: loc.storefrontAddress?.addressLines?.join(', '),
    primaryPhone: loc.phoneNumbers?.primaryPhone ?? undefined,
    websiteUri: loc.websiteUri ?? undefined,
  }));
}

/**
 * Get detailed profile for a specific location.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - Google Business Profile account ID
 * @param locationId - Location ID within the account
 * @returns Location details or null if not found
 */
export async function getBusinessProfile(
  tenantId: string,
  accountId: string,
  locationId: string
): Promise<LocationInfo | null> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const businessInfo = google.mybusinessbusinessinformation({
    version: 'v1',
    auth: client,
  });

  try {
    // Use locations.get via mybusinessbusinessinformation API
    const response = await businessInfo.locations.get({
      name: `locations/${locationId}`,
      readMask: 'name,title,storefrontAddress,phoneNumbers,websiteUri',
    });

    const loc = response.data;
    return {
      locationId: loc.name?.split('/').pop() || '',
      name: loc.name || '',
      title: loc.title || '',
      address: loc.storefrontAddress?.addressLines?.join(', '),
      primaryPhone: loc.phoneNumbers?.primaryPhone ?? undefined,
      websiteUri: loc.websiteUri ?? undefined,
    };
  } catch (error: any) {
    console.error('[google/profile] Failed to get business profile:', error.message);
    return null;
  }
}

/**
 * Get account info for debugging/verification.
 *
 * Uses mybusinessaccountmanagement API for account details.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - Google Business Profile account ID
 * @returns Account info or null if not found
 */
export async function getAccountInfo(
  tenantId: string,
  accountId: string
): Promise<{ accountId: string; accountName: string } | null> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const accountManagement = google.mybusinessaccountmanagement({
    version: 'v1',
    auth: client,
  });

  try {
    const response = await accountManagement.accounts.get({
      name: `accounts/${accountId}`,
    });

    return {
      accountId: response.data.name?.replace('accounts/', '') || '',
      accountName: response.data.accountName || '',
    };
  } catch (error: any) {
    console.error('[google/profile] Failed to get account info:', error.message);
    return null;
  }
}
