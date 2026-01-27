/**
 * Israeli phone number normalization utilities.
 *
 * Handles various input formats and normalizes to international format (+972XXXXXXXXX).
 */

/**
 * Normalize Israeli phone number to international format (+972XXXXXXXXX).
 *
 * Handles various input formats:
 * - Local: 0501234567 -> +972501234567
 * - International: +972501234567 -> +972501234567 (unchanged)
 * - With dashes: 050-123-4567 -> +972501234567
 * - With spaces: 050 123 4567 -> +972501234567
 * - Without leading zero: 501234567 -> +972501234567 (if 9 digits starting with 5)
 * - With country code no plus: 972501234567 -> +972501234567
 *
 * @param phone - Phone number in any Israeli format
 * @returns Phone number in +972XXXXXXXXX format, or original cleaned if cannot parse
 *
 * @example
 * ```typescript
 * normalizeIsraeliPhone("0501234567")      // "+972501234567"
 * normalizeIsraeliPhone("+972501234567")   // "+972501234567"
 * normalizeIsraeliPhone("050-123-4567")    // "+972501234567"
 * normalizeIsraeliPhone("050 123 4567")    // "+972501234567"
 * normalizeIsraeliPhone("501234567")       // "+972501234567"
 * normalizeIsraeliPhone("972501234567")    // "+972501234567"
 * ```
 */
export function normalizeIsraeliPhone(phone: string): string {
  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // If starts with +972, already international
  if (cleaned.startsWith('+972')) {
    return cleaned;
  }

  // If starts with 972 (no +), add +
  if (cleaned.startsWith('972')) {
    return '+' + cleaned;
  }

  // If starts with 0, replace with +972
  if (cleaned.startsWith('0')) {
    return '+972' + cleaned.slice(1);
  }

  // If 9 digits starting with 5, assume Israeli mobile (no leading 0)
  if (cleaned.length === 9 && /^[5]/.test(cleaned)) {
    return '+972' + cleaned;
  }

  // Cannot normalize - return original cleaned version
  return cleaned;
}

/**
 * Format phone number for display (Israeli format with dashes).
 *
 * Converts international format to local Israeli display format.
 *
 * @param phone - Phone number in international format (+972XXXXXXXXX)
 * @returns Phone number formatted as 050-123-4567
 *
 * @example
 * ```typescript
 * formatPhoneDisplay("+972501234567")  // "050-123-4567"
 * formatPhoneDisplay("0501234567")     // "050-123-4567"
 * formatPhoneDisplay("+972-50-123-4567") // "050-123-4567"
 * ```
 */
export function formatPhoneDisplay(phone: string): string {
  // Remove everything except digits
  const digitsOnly = phone.replace(/\D/g, '');

  // Remove 972 prefix if present, add leading 0
  let local: string;
  if (digitsOnly.startsWith('972')) {
    local = '0' + digitsOnly.slice(3);
  } else if (!digitsOnly.startsWith('0') && digitsOnly.length === 9) {
    local = '0' + digitsOnly;
  } else {
    local = digitsOnly;
  }

  // Format as 0XX-XXX-XXXX (standard Israeli format)
  if (local.length === 10 && local.startsWith('0')) {
    return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`;
  }

  // If can't format properly, return as-is
  return local;
}

/**
 * Check if a phone number looks like a valid Israeli mobile number.
 *
 * Israeli mobile numbers start with 05X (050-059) and have 10 digits.
 *
 * @param phone - Phone number in any format
 * @returns true if the number appears to be a valid Israeli mobile
 *
 * @example
 * ```typescript
 * isValidIsraeliMobile("+972501234567")  // true
 * isValidIsraeliMobile("0501234567")     // true
 * isValidIsraeliMobile("0371234567")     // false (landline prefix)
 * isValidIsraeliMobile("invalid")        // false
 * ```
 */
export function isValidIsraeliMobile(phone: string): boolean {
  // Normalize first
  const normalized = normalizeIsraeliPhone(phone);

  // Check format: +972 followed by 5X and 7 more digits
  return /^\+9725\d{8}$/.test(normalized);
}
