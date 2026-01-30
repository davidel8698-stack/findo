/**
 * Step 1: Business Information Form
 *
 * Collects minimal business info for 2-minute setup:
 * - Business name, type, owner name
 * - Owner email and phone
 * - Business address and hours
 */

import { renderSetupLayout } from './layout';

export interface Step1Data {
  businessName?: string;
  businessType?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  address?: string;
  businessHours?: {
    [day: string]: { open: string; close: string; closed?: boolean };
  };
}

interface Step1Options {
  prefill?: Partial<Step1Data>;
  error?: string;
  tenantId?: string; // Pass through for new tenant creation
}

// Hebrew day names (Israeli week starts Sunday)
const DAYS = [
  { key: 'sunday', name: 'ראשון' },
  { key: 'monday', name: 'שני' },
  { key: 'tuesday', name: 'שלישי' },
  { key: 'wednesday', name: 'רביעי' },
  { key: 'thursday', name: 'חמישי' },
  { key: 'friday', name: 'שישי' },
  { key: 'saturday', name: 'שבת' },
];

// Time options (7:00-22:00 in 30-min increments)
function generateTimeOptions(): string {
  const times: string[] = [];
  for (let hour = 7; hour <= 22; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 22) {
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return times
    .map((t) => `<option value="${t}">${t}</option>`)
    .join('');
}

// Business type options
const BUSINESS_TYPES = [
  { value: 'plumber', label: 'אינסטלטור' },
  { value: 'electrician', label: 'חשמלאי' },
  { value: 'garage', label: 'מוסך' },
  { value: 'general_contractor', label: 'קבלן שיפוצים' },
  { value: 'other', label: 'אחר' },
];

/**
 * Render the business information form (step 1).
 */
export function renderStep1Business(options: Step1Options = {}): string {
  const { prefill = {}, error, tenantId } = options;
  const timeOptions = generateTimeOptions();

  // Build business type options
  const businessTypeOptions = BUSINESS_TYPES.map(
    (bt) =>
      `<option value="${bt.value}" ${prefill.businessType === bt.value ? 'selected' : ''}>${bt.label}</option>`
  ).join('');

  // Build business hours UI
  const businessHoursUI = DAYS.map((day) => {
    const dayHours = prefill.businessHours?.[day.key] || { open: '08:00', close: '18:00' };
    const isClosed = dayHours.closed === true;

    return `
      <div class="hours-row" data-day="${day.key}">
        <div class="hours-day">
          <label class="checkbox-label">
            <input type="checkbox" name="hours_${day.key}_active" ${!isClosed ? 'checked' : ''} onchange="toggleDayHours('${day.key}', this.checked)">
            <span>${day.name}</span>
          </label>
        </div>
        <div class="hours-times" id="times_${day.key}" style="${isClosed ? 'opacity: 0.4; pointer-events: none;' : ''}">
          <select name="hours_${day.key}_open" class="time-select">
            ${timeOptions.replace(`value="${dayHours.open}"`, `value="${dayHours.open}" selected`)}
          </select>
          <span class="hours-separator">-</span>
          <select name="hours_${day.key}_close" class="time-select">
            ${timeOptions.replace(`value="${dayHours.close}"`, `value="${dayHours.close}" selected`)}
          </select>
        </div>
      </div>
    `;
  }).join('');

  const content = `
    <div class="section-header">
      <h1 class="section-title">פרטי העסק</h1>
      <p class="section-subtitle">ספרו לנו על העסק שלכם כדי שנוכל להתאים את Findo בדיוק לצרכים שלכם</p>
    </div>

    ${error ? `<div class="form-error-banner">${error}</div>` : ''}

    <form method="POST" action="/setup/step/1" id="step1Form">
      ${tenantId ? `<input type="hidden" name="tenantId" value="${tenantId}">` : ''}

      <!-- Business Name -->
      <div class="form-group">
        <label class="form-label required" for="businessName">שם העסק</label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          class="form-input"
          value="${prefill.businessName || ''}"
          placeholder="לדוגמה: אינסטלציה מהירה"
          required
          minlength="2"
          maxlength="255"
        >
      </div>

      <!-- Business Type -->
      <div class="form-group">
        <label class="form-label required" for="businessType">סוג העסק</label>
        <select id="businessType" name="businessType" class="form-select" required>
          <option value="">בחרו סוג עסק</option>
          ${businessTypeOptions}
        </select>
      </div>

      <!-- Owner Name -->
      <div class="form-group">
        <label class="form-label required" for="ownerName">שם בעל העסק</label>
        <input
          type="text"
          id="ownerName"
          name="ownerName"
          class="form-input"
          value="${prefill.ownerName || ''}"
          placeholder="לדוגמה: יוסי כהן"
          required
          minlength="2"
          maxlength="255"
        >
      </div>

      <!-- Owner Email -->
      <div class="form-group">
        <label class="form-label required" for="ownerEmail">אימייל</label>
        <input
          type="email"
          id="ownerEmail"
          name="ownerEmail"
          class="form-input"
          value="${prefill.ownerEmail || ''}"
          placeholder="email@example.com"
          required
          maxlength="255"
          dir="ltr"
        >
        <p class="form-hint">לשליחת סיכומים וחשבוניות</p>
      </div>

      <!-- Owner Phone -->
      <div class="form-group">
        <label class="form-label" for="ownerPhone">טלפון נייד</label>
        <input
          type="tel"
          id="ownerPhone"
          name="ownerPhone"
          class="form-input"
          value="${prefill.ownerPhone || ''}"
          placeholder="050-1234567"
          pattern="^0[5-9][0-9]{8}$"
          maxlength="12"
          dir="ltr"
        >
        <p class="form-hint">לקבלת התראות ב-WhatsApp (מומלץ)</p>
      </div>

      <!-- Address -->
      <div class="form-group">
        <label class="form-label" for="address">כתובת העסק</label>
        <textarea
          id="address"
          name="address"
          class="form-textarea"
          placeholder="רחוב, עיר"
          maxlength="500"
          rows="2"
        >${prefill.address || ''}</textarea>
        <p class="form-hint">יופיע בפרופיל ב-Google (אופציונלי)</p>
      </div>

      <!-- Business Hours -->
      <div class="form-group">
        <div class="hours-header">
          <label class="form-label">שעות פעילות</label>
          <button type="button" class="copy-hours-btn" onclick="copyToAll()">העתק לכולם</button>
        </div>
        <div class="hours-container">
          ${businessHoursUI}
        </div>
        <p class="form-hint">סמנו את הימים בהם העסק פתוח</p>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn-primary">
        המשך
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(180deg);">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    </form>

    <style>
      .form-error-banner {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
      }

      .hours-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .copy-hours-btn {
        background: none;
        border: none;
        color: #667eea;
        font-size: 13px;
        cursor: pointer;
        text-decoration: underline;
      }

      .copy-hours-btn:hover {
        color: #5a67d8;
      }

      .hours-container {
        background: #f9fafb;
        border-radius: 8px;
        padding: 12px;
      }

      .hours-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .hours-row:last-child {
        border-bottom: none;
      }

      .hours-day {
        flex: 1;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
        color: #374151;
      }

      .checkbox-label input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #667eea;
      }

      .hours-times {
        display: flex;
        align-items: center;
        gap: 8px;
        transition: opacity 0.2s;
      }

      .time-select {
        padding: 6px 8px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        background: white;
        direction: ltr;
      }

      .time-select:focus {
        outline: none;
        border-color: #667eea;
      }

      .hours-separator {
        color: #6b7280;
      }

      .btn-primary {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .btn-primary svg {
        flex-shrink: 0;
      }

      /* Validation styles */
      .form-input:invalid:not(:placeholder-shown),
      .form-select:invalid:not([value=""]) {
        border-color: #ef4444;
      }

      @media (max-width: 480px) {
        .hours-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .hours-times {
          width: 100%;
          justify-content: flex-start;
        }
      }
    </style>

    <script>
      // Toggle day hours visibility
      function toggleDayHours(day, active) {
        const timesEl = document.getElementById('times_' + day);
        if (timesEl) {
          timesEl.style.opacity = active ? '1' : '0.4';
          timesEl.style.pointerEvents = active ? 'auto' : 'none';
        }
      }

      // Copy first active day's hours to all days
      function copyToAll() {
        // Find first active day
        const rows = document.querySelectorAll('.hours-row');
        let sourceOpen = null;
        let sourceClose = null;

        for (const row of rows) {
          const day = row.dataset.day;
          const checkbox = row.querySelector('input[type="checkbox"]');
          if (checkbox && checkbox.checked) {
            const openSelect = row.querySelector('select[name="hours_' + day + '_open"]');
            const closeSelect = row.querySelector('select[name="hours_' + day + '_close"]');
            if (openSelect && closeSelect) {
              sourceOpen = openSelect.value;
              sourceClose = closeSelect.value;
              break;
            }
          }
        }

        if (!sourceOpen || !sourceClose) {
          alert('אנא הגדירו שעות ליום אחד לפחות');
          return;
        }

        // Apply to all days
        for (const row of rows) {
          const day = row.dataset.day;
          const openSelect = row.querySelector('select[name="hours_' + day + '_open"]');
          const closeSelect = row.querySelector('select[name="hours_' + day + '_close"]');
          if (openSelect && closeSelect) {
            openSelect.value = sourceOpen;
            closeSelect.value = sourceClose;
          }
        }
      }

      // Form submission with loading
      document.getElementById('step1Form').addEventListener('submit', function(e) {
        const form = e.target;
        if (!form.checkValidity()) {
          return;
        }
        showLoading('שומר פרטי עסק...');
      });
    </script>
  `;

  return renderSetupLayout({
    step: 1,
    title: 'פרטי העסק',
    content,
  });
}
