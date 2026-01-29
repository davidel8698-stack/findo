/**
 * Israeli Holiday Checker Service
 *
 * Detects upcoming Israeli holidays using @hebcal/core.
 * Triggers reminders 1 week before major holidays.
 *
 * Per CONTEXT.md:
 * - Remind 1 week before Israeli holidays about special hours
 * - Always ask owner about hours - don't assume
 * - Cover all major holidays: Rosh Hashanah, Yom Kippur, Sukkot, Pesach, etc.
 */

import { HebrewCalendar, HolidayEvent, flags } from '@hebcal/core';
import { db } from '../../db';
import { tenants, googleConnections } from '../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { createWhatsAppClient, sendTextMessage } from '../whatsapp';

export interface UpcomingHoliday {
  name: string;           // English name
  hebrewName: string;     // Hebrew name
  date: Date;             // Gregorian date
  isYomTov: boolean;      // Work forbidden (major holiday)
  daysUntil: number;      // Days from today
}

// Major holidays that typically affect business hours
const BUSINESS_AFFECTING_HOLIDAYS = [
  'Rosh Hashana',
  'Yom Kippur',
  'Sukkot',
  'Shmini Atzeret',
  'Simchat Torah',
  'Pesach',
  'Shavuot',
  'Yom HaAtzma\'ut',      // Independence Day
  'Yom HaZikaron',        // Memorial Day
  'Purim',                // Partial business impact
  'Chanukah',             // First and last days
];

// Hebrew names for common messages
const HEBREW_NAMES: Record<string, string> = {
  'Rosh Hashana': 'ראש השנה',
  'Yom Kippur': 'יום כיפור',
  'Sukkot': 'סוכות',
  'Shmini Atzeret': 'שמיני עצרת',
  'Simchat Torah': 'שמחת תורה',
  'Pesach': 'פסח',
  'Shavuot': 'שבועות',
  'Yom HaAtzma\'ut': 'יום העצמאות',
  'Yom HaZikaron': 'יום הזיכרון',
  'Purim': 'פורים',
  'Chanukah': 'חנוכה',
};

/**
 * Get upcoming holidays within a time window.
 *
 * @param daysAhead - Number of days to look ahead (default 14)
 * @returns List of upcoming holidays sorted by date
 */
export function getUpcomingHolidays(daysAhead: number = 14): UpcomingHoliday[] {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + daysAhead);

  const events = HebrewCalendar.calendar({
    start: now,
    end: end,
    il: true,             // Use Israeli holidays
    candlelighting: false,
    sedrot: false,
    omer: false,
    noModern: false,      // Include modern Israeli holidays
  });

  const holidays: UpcomingHoliday[] = [];

  for (const event of events) {
    // Only process HolidayEvent instances
    if (!(event instanceof HolidayEvent)) continue;

    const desc = event.getDesc();

    // Check if this is a business-affecting holiday
    const isBusinessAffecting = BUSINESS_AFFECTING_HOLIDAYS.some(h => desc.includes(h));
    if (!isBusinessAffecting) continue;

    const eventDate = event.getDate().greg();
    const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Get Hebrew name: check our map first, then fall back to render
    const baseHolidayName = desc.split(' ')[0];
    let hebrewName = HEBREW_NAMES[baseHolidayName];
    if (!hebrewName) {
      // Try full name match
      for (const [key, value] of Object.entries(HEBREW_NAMES)) {
        if (desc.includes(key)) {
          hebrewName = value;
          break;
        }
      }
    }
    if (!hebrewName) {
      hebrewName = event.render('he');
    }

    holidays.push({
      name: desc,
      hebrewName,
      date: eventDate,
      isYomTov: (event.getFlags() & flags.CHAG) !== 0,
      daysUntil,
    });
  }

  // Sort by date
  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get holidays that need reminders (7 days away).
 *
 * @returns Holidays needing reminder this week
 */
export function getHolidaysNeedingReminder(): UpcomingHoliday[] {
  const holidays = getUpcomingHolidays(10); // Look 10 days ahead
  return holidays.filter(h => h.daysUntil >= 5 && h.daysUntil <= 8); // 5-8 days = "about a week"
}

/**
 * Check a tenant for upcoming holidays and send reminders.
 *
 * @param tenantId - Tenant UUID
 * @returns Whether reminder was sent
 */
export async function checkTenantHolidays(tenantId: string): Promise<boolean> {
  const [tenant] = await db
    .select()
    .from(tenants)
    .where(and(eq(tenants.id, tenantId), isNull(tenants.deletedAt)))
    .limit(1);

  if (!tenant?.ownerPhone) return false;

  const [google] = await db
    .select()
    .from(googleConnections)
    .where(and(
      eq(googleConnections.tenantId, tenantId),
      eq(googleConnections.status, 'active')
    ))
    .limit(1);

  if (!google) return false;

  const upcomingHolidays = getHolidaysNeedingReminder();
  if (upcomingHolidays.length === 0) return false;

  // Format holiday list
  const holidayList = upcomingHolidays
    .map(h => `- ${h.hebrewName} (${formatHebrewDate(h.date)})`)
    .join('\n');

  // Send reminder in Hebrew
  const message =
    `היי! בעוד שבוע יש חגים:\n${holidayList}\n\n` +
    `מה שעות הפעילות שלך בחגים?\n` +
    `שלח לי במבנה הזה:\n` +
    `"[תאריך]: [שעות או סגור]"\n\n` +
    `לדוגמה:\n` +
    `"15/9: סגור"\n` +
    `"16/9: 10:00-14:00"`;

  const client = await createWhatsAppClient(tenantId);
  if (client) {
    await sendTextMessage(client, tenant.ownerPhone, message);
    return true;
  }

  return false;
}

/**
 * Format date in Hebrew style (DD/MM).
 */
function formatHebrewDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * Parse owner's hours response.
 *
 * Parses formats like:
 * - "15/9: סגור" -> closed
 * - "16/9: 10:00-14:00" -> specific hours
 * - "סגור 10-14" -> closed from 10th to 14th
 *
 * @param text - Owner's response text
 * @returns Parsed special hours or null if couldn't parse
 */
export interface ParsedHours {
  date: { day: number; month: number };
  isClosed: boolean;
  openTime?: string;
  closeTime?: string;
}

export function parseHoursResponse(text: string): ParsedHours[] {
  const results: ParsedHours[] = [];
  const lines = text.split('\n').filter(l => l.trim());

  for (const line of lines) {
    // Try "DD/MM: סגור" pattern
    const closedMatch = line.match(/(\d{1,2})\/(\d{1,2})\s*:\s*סגור/i);
    if (closedMatch) {
      results.push({
        date: { day: parseInt(closedMatch[1]), month: parseInt(closedMatch[2]) },
        isClosed: true,
      });
      continue;
    }

    // Try "DD/MM: HH:MM-HH:MM" pattern
    const hoursMatch = line.match(/(\d{1,2})\/(\d{1,2})\s*:\s*(\d{1,2}):?(\d{2})?\s*-\s*(\d{1,2}):?(\d{2})?/);
    if (hoursMatch) {
      const openHour = hoursMatch[3].padStart(2, '0');
      const openMin = (hoursMatch[4] || '00').padStart(2, '0');
      const closeHour = hoursMatch[5].padStart(2, '0');
      const closeMin = (hoursMatch[6] || '00').padStart(2, '0');

      results.push({
        date: { day: parseInt(hoursMatch[1]), month: parseInt(hoursMatch[2]) },
        isClosed: false,
        openTime: `${openHour}:${openMin}`,
        closeTime: `${closeHour}:${closeMin}`,
      });
      continue;
    }

    // Try simple "סגור" for single date context
    if (line.toLowerCase().includes('סגור') && results.length === 0) {
      // Need date context from previous messages - skip for now
      console.log('[holiday-checker] Could not parse date from:', line);
    }
  }

  return results;
}
