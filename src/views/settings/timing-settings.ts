/**
 * Timing Settings Component
 *
 * Renders timing configuration form for review requests and reminders.
 * Per CONTEXT.md: "Timing settings adjustable - Findo defaults are optimized,
 * but owner can access settings to change individual timings"
 *
 * Form fields:
 * - Review request delay (12/24/48/72 hours)
 * - Review reminder delay (1/2/3/5/7 days)
 */

export interface TimingSettingsData {
  reviewRequestDelayHours: number;
  reviewReminderDelayDays: number;
}

/**
 * Renders the timing settings form HTML.
 *
 * @param data - Current timing settings values (or defaults)
 * @returns HTML string for the timing settings form
 */
export function renderTimingSettings(data?: TimingSettingsData): string {
  const delayHours = data?.reviewRequestDelayHours ?? 24;
  const reminderDays = data?.reviewReminderDelayDays ?? 3;

  const delayOptions = [
    { value: 12, label: '12 שעות' },
    { value: 24, label: '24 שעות (ברירת מחדל)' },
    { value: 48, label: '48 שעות' },
    { value: 72, label: '72 שעות' },
  ];

  const reminderOptions = [
    { value: 1, label: 'יום אחד' },
    { value: 2, label: 'יומיים' },
    { value: 3, label: '3 ימים (ברירת מחדל)' },
    { value: 5, label: '5 ימים' },
    { value: 7, label: 'שבוע' },
  ];

  return `
    <div class="space-y-6">
      <!-- Info Note -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex gap-3">
          <span class="text-blue-500 text-xl">&#9432;</span>
          <div>
            <p class="text-sm text-blue-800 font-medium">ברירות המחדל של Findo מותאמות לרוב העסקים</p>
            <p class="text-sm text-blue-600 mt-1">שנה רק אם יש לך צורך ספציפי.</p>
          </div>
        </div>
      </div>

      <!-- Review Request Delay -->
      <div class="space-y-2">
        <label for="reviewRequestDelay" class="block text-sm font-medium text-gray-700">
          שעות המתנה לפני בקשת ביקורת
        </label>
        <p class="text-xs text-gray-500">
          כמה זמן לחכות אחרי שירות לפני שליחת בקשה לביקורת
        </p>
        <select
          id="reviewRequestDelay"
          name="reviewRequestDelayHours"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          ${delayOptions
            .map(
              (opt) => `
            <option value="${opt.value}" ${opt.value === delayHours ? 'selected' : ''}>
              ${opt.label}
            </option>
          `
            )
            .join('')}
        </select>
      </div>

      <!-- Review Reminder Delay -->
      <div class="space-y-2">
        <label for="reviewReminderDelay" class="block text-sm font-medium text-gray-700">
          ימים לתזכורת ביקורת
        </label>
        <p class="text-xs text-gray-500">
          כמה ימים לחכות לפני שליחת תזכורת אם הלקוח לא הגיב
        </p>
        <select
          id="reviewReminderDelay"
          name="reviewReminderDelayDays"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          ${reminderOptions
            .map(
              (opt) => `
            <option value="${opt.value}" ${opt.value === reminderDays ? 'selected' : ''}>
              ${opt.label}
            </option>
          `
            )
            .join('')}
        </select>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onclick="saveTimingSettings()"
          class="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          שמור שינויים
        </button>
        <button
          type="button"
          onclick="resetTimingSettings()"
          class="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          אפס לברירת מחדל
        </button>
      </div>
    </div>
  `;
}
