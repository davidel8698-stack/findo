// Israeli phone validation and formatting utilities for conversion flow

/**
 * Valid Israeli mobile prefixes
 * 050, 052, 053, 054, 055, 056, 058, 059
 */
const VALID_ISRAELI_MOBILE_PREFIXES = [
  "050",
  "052",
  "053",
  "054",
  "055",
  "056",
  "058",
  "059",
];

/**
 * Validates Israeli mobile phone number
 *
 * @param phone - Phone number (can include dashes, spaces, or other non-digit characters)
 * @returns true if valid Israeli mobile number, false otherwise
 *
 * @example
 * isValidIsraeliPhone("0501234567")     // true
 * isValidIsraeliPhone("050-123-4567")   // true (strips non-digits)
 * isValidIsraeliPhone("0561234567")     // true (056 is valid)
 * isValidIsraeliPhone("0591234567")     // true (059 is valid)
 * isValidIsraeliPhone("0401234567")     // false (invalid prefix)
 * isValidIsraeliPhone("050123456")      // false (9 digits)
 */
export function isValidIsraeliPhone(phone: string): boolean {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Must be exactly 10 digits
  if (digits.length !== 10) {
    return false;
  }

  // Extract prefix (first 3 digits)
  const prefix = digits.slice(0, 3);

  // Check if prefix is valid Israeli mobile prefix
  return VALID_ISRAELI_MOBILE_PREFIXES.includes(prefix);
}

/**
 * Formats Israeli phone number progressively as user types
 *
 * @param phone - Phone number input (can include any characters)
 * @returns Formatted phone number: "050" -> "050-123" -> "050-123-4567"
 *
 * @example
 * formatIsraeliPhone("050")         // "050"
 * formatIsraeliPhone("050123")      // "050-123"
 * formatIsraeliPhone("0501234567")  // "050-123-4567"
 * formatIsraeliPhone("050-12-34")   // "050-123-4" (normalizes input)
 */
export function formatIsraeliPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Limit to 10 digits max
  const limited = digits.slice(0, 10);

  // 3 digits or less: return as-is (e.g., "050")
  if (limited.length <= 3) {
    return limited;
  }

  // 4-6 digits: format as "050-123"
  if (limited.length <= 6) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  }

  // 7+ digits: format as "050-123-4567"
  return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
}
