/**
 * Notification Preferences Component
 *
 * Renders notification toggle form for all event types.
 * Per CONTEXT.md: "Granular notification preferences - Choose exactly which events trigger WhatsApp notifications"
 *
 * Toggle groups:
 * - Leads: new, qualified, unresponsive
 * - Reviews: new, negative (always on), posted
 * - Content: photo request, post approval
 * - System: alerts, weekly report
 */

export interface NotificationPrefsData {
  notifyNewLead: boolean;
  notifyLeadQualified: boolean;
  notifyLeadUnresponsive: boolean;
  notifyNewReview: boolean;
  notifyNegativeReview: boolean;
  notifyReviewPosted: boolean;
  notifyPhotoRequest: boolean;
  notifyPostApproval: boolean;
  notifySystemAlert: boolean;
  notifyWeeklyReport: boolean;
}

interface ToggleConfig {
  id: string;
  field: keyof NotificationPrefsData;
  label: string;
  description?: string;
  disabled?: boolean;
  alwaysOn?: boolean;
}

interface ToggleGroup {
  title: string;
  icon: string;
  toggles: ToggleConfig[];
}

/**
 * Renders a single toggle switch.
 */
function renderToggle(config: ToggleConfig, checked: boolean): string {
  const isDisabled = config.disabled || config.alwaysOn;

  return `
    <div class="flex items-center justify-between py-3 ${isDisabled ? 'opacity-60' : ''}">
      <div class="flex-1">
        <label for="${config.id}" class="font-medium text-gray-800 text-sm">${config.label}</label>
        ${config.description ? `<p class="text-xs text-gray-500 mt-0.5">${config.description}</p>` : ''}
      </div>
      <label class="relative inline-flex items-center cursor-pointer ${isDisabled ? 'cursor-not-allowed' : ''}">
        <input
          type="checkbox"
          id="${config.id}"
          name="${config.field}"
          ${checked ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}
          class="sr-only peer"
          onchange="onNotificationToggle('${config.field}', this.checked)"
        >
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  `;
}

/**
 * Renders a toggle group card.
 */
function renderToggleGroup(group: ToggleGroup, data: NotificationPrefsData): string {
  return `
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <span class="text-lg">${group.icon}</span>
        <h3 class="font-semibold text-gray-800">${group.title}</h3>
      </div>
      <div class="divide-y divide-gray-100">
        ${group.toggles.map((toggle) => renderToggle(toggle, data[toggle.field])).join('')}
      </div>
    </div>
  `;
}

/**
 * Renders the notification preferences form HTML.
 *
 * @param data - Current notification preferences (or defaults)
 * @returns HTML string for the notification preferences form
 */
export function renderNotificationPrefs(data?: NotificationPrefsData): string {
  const prefs: NotificationPrefsData = {
    notifyNewLead: data?.notifyNewLead ?? true,
    notifyLeadQualified: data?.notifyLeadQualified ?? true,
    notifyLeadUnresponsive: data?.notifyLeadUnresponsive ?? true,
    notifyNewReview: data?.notifyNewReview ?? true,
    notifyNegativeReview: data?.notifyNegativeReview ?? true,
    notifyReviewPosted: data?.notifyReviewPosted ?? false,
    notifyPhotoRequest: data?.notifyPhotoRequest ?? true,
    notifyPostApproval: data?.notifyPostApproval ?? true,
    notifySystemAlert: data?.notifySystemAlert ?? true,
    notifyWeeklyReport: data?.notifyWeeklyReport ?? true,
  };

  const groups: ToggleGroup[] = [
    {
      title: 'לידים',
      icon: '&#128100;',
      toggles: [
        {
          id: 'notifyNewLead',
          field: 'notifyNewLead',
          label: 'ליד חדש',
          description: 'התראה כאשר מישהו יוצר קשר דרך הצאטבוט',
        },
        {
          id: 'notifyLeadQualified',
          field: 'notifyLeadQualified',
          label: 'ליד הוסמך',
          description: 'התראה כאשר ליד סיים את תהליך ההסמכה',
        },
        {
          id: 'notifyLeadUnresponsive',
          field: 'notifyLeadUnresponsive',
          label: 'ליד לא הגיב',
          description: 'התראה כאשר ליד לא הגיב לאחר התזכורות',
        },
      ],
    },
    {
      title: 'ביקורות',
      icon: '&#11088;',
      toggles: [
        {
          id: 'notifyNewReview',
          field: 'notifyNewReview',
          label: 'ביקורת חדשה',
          description: 'התראה כאשר מתקבלת ביקורת חדשה בגוגל',
        },
        {
          id: 'notifyNegativeReview',
          field: 'notifyNegativeReview',
          label: 'ביקורת שלילית',
          description: 'תמיד פעיל - ביקורות שליליות דורשות אישור',
          disabled: true,
          alwaysOn: true,
        },
        {
          id: 'notifyReviewPosted',
          field: 'notifyReviewPosted',
          label: 'ביקורת פורסמה',
          description: 'התראה כאשר תגובה לביקורת פורסמה בגוגל',
        },
      ],
    },
    {
      title: 'תוכן',
      icon: '&#128247;',
      toggles: [
        {
          id: 'notifyPhotoRequest',
          field: 'notifyPhotoRequest',
          label: 'בקשת תמונות',
          description: 'בקשה שבועית להעלאת תמונות לפרופיל',
        },
        {
          id: 'notifyPostApproval',
          field: 'notifyPostApproval',
          label: 'אישור פוסט',
          description: 'בקשה לאישור פוסט חודשי לפרופיל',
        },
      ],
    },
    {
      title: 'מערכת',
      icon: '&#9881;',
      toggles: [
        {
          id: 'notifySystemAlert',
          field: 'notifySystemAlert',
          label: 'התראות מערכת',
          description: 'התראות על בעיות חיבור או ביצועים',
        },
        {
          id: 'notifyWeeklyReport',
          field: 'notifyWeeklyReport',
          label: 'דוח שבועי',
          description: 'סיכום שבועי של פעילות העסק',
        },
      ],
    },
  ];

  return `
    <div class="space-y-4">
      <!-- Groups -->
      ${groups.map((group) => renderToggleGroup(group, prefs)).join('')}

      <!-- Actions -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onclick="saveNotificationPrefs()"
          class="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          שמור שינויים
        </button>
        <button
          type="button"
          onclick="resetNotificationPrefs()"
          class="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          אפס לברירת מחדל
        </button>
      </div>
    </div>
  `;
}
