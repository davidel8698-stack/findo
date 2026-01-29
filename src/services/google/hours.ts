/**
 * Google Business Profile Hours Service
 *
 * Update business hours on GBP, particularly special hours for holidays.
 *
 * Per RESEARCH.md:
 * - Use specific updateMask ('specialHours.specialHourPeriods'), never '*'
 * - Special hours add to regular hours, don't replace them
 */

import { createAuthenticatedClient } from './oauth';

const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

export interface SpecialHourPeriod {
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  isClosed: boolean;
  openTime?: string;  // HH:MM format
  closeTime?: string; // HH:MM format
}

export interface RegularHours {
  periods: Array<{
    openDay: string;   // MONDAY, TUESDAY, etc.
    openTime: string;  // HH:MM
    closeDay: string;
    closeTime: string;
  }>;
}

interface LocationHoursResponse {
  regularHours?: {
    periods?: Array<{
      openDay?: string;
      openTime?: string;
      closeDay?: string;
      closeTime?: string;
    }>;
  };
  specialHours?: {
    specialHourPeriods?: Array<{
      startDate?: { year?: number; month?: number; day?: number };
      endDate?: { year?: number; month?: number; day?: number };
      isClosed?: boolean;
      openTime?: string;
      closeTime?: string;
    }>;
  };
}

/**
 * Get current business hours for a location.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - GBP account ID
 * @param locationId - Location ID
 * @returns Regular and special hours
 */
export async function getLocationHours(
  tenantId: string,
  accountId: string,
  locationId: string
): Promise<{ regular: RegularHours | null; special: SpecialHourPeriod[] }> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}`;

  const response = await client.request<LocationHoursResponse>({ url });

  const regular: RegularHours | null = response.data.regularHours?.periods
    ? {
        periods: response.data.regularHours.periods.map(p => ({
          openDay: p.openDay || '',
          openTime: p.openTime || '',
          closeDay: p.closeDay || '',
          closeTime: p.closeTime || '',
        })),
      }
    : null;

  const special: SpecialHourPeriod[] = (response.data.specialHours?.specialHourPeriods || [])
    .map(p => ({
      startDate: {
        year: p.startDate?.year || new Date().getFullYear(),
        month: p.startDate?.month || 1,
        day: p.startDate?.day || 1,
      },
      endDate: {
        year: p.endDate?.year || new Date().getFullYear(),
        month: p.endDate?.month || 1,
        day: p.endDate?.day || 1,
      },
      isClosed: p.isClosed || false,
      openTime: p.openTime,
      closeTime: p.closeTime,
    }));

  return { regular, special };
}

/**
 * Set special hours for a location.
 *
 * IMPORTANT: This MERGES with existing special hours. Conflicting dates
 * are replaced with the new values.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - GBP account ID
 * @param locationId - Location ID
 * @param periods - Special hour periods to set
 */
export async function setSpecialHours(
  tenantId: string,
  accountId: string,
  locationId: string,
  periods: SpecialHourPeriod[]
): Promise<void> {
  const client = await createAuthenticatedClient(tenantId);

  if (!client) {
    throw new Error(`No valid Google credentials for tenant ${tenantId}`);
  }

  // Get existing special hours to merge
  const { special: existing } = await getLocationHours(tenantId, accountId, locationId);

  // Merge: remove conflicting dates, add new ones
  const merged = [...existing];

  for (const newPeriod of periods) {
    // Remove any existing period for the same date
    const index = merged.findIndex(
      p =>
        p.startDate.year === newPeriod.startDate.year &&
        p.startDate.month === newPeriod.startDate.month &&
        p.startDate.day === newPeriod.startDate.day
    );

    if (index >= 0) {
      merged.splice(index, 1);
    }

    merged.push(newPeriod);
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}`;

  // Use specific updateMask - NEVER use '*' per RESEARCH.md
  await client.request({
    url,
    method: 'PATCH',
    params: {
      updateMask: 'specialHours.specialHourPeriods',
    },
    data: {
      specialHours: {
        specialHourPeriods: merged.map(p => ({
          startDate: p.startDate,
          endDate: p.endDate,
          isClosed: p.isClosed,
          ...(p.openTime && { openTime: p.openTime }),
          ...(p.closeTime && { closeTime: p.closeTime }),
        })),
      },
    },
  });
}

/**
 * Helper: Create a special hour period for a single day.
 *
 * @param date - The date
 * @param isClosed - Whether closed
 * @param openTime - Opening time (HH:MM)
 * @param closeTime - Closing time (HH:MM)
 * @returns Special hour period
 */
export function createSingleDayPeriod(
  date: Date,
  isClosed: boolean,
  openTime?: string,
  closeTime?: string
): SpecialHourPeriod {
  const dateObj = {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // API uses 1-12
    day: date.getDate(),
  };

  return {
    startDate: dateObj,
    endDate: dateObj,
    isClosed,
    openTime,
    closeTime,
  };
}
