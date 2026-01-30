/**
 * Step 3: Google Business Profile Connection
 *
 * Connects Google Business Profile using OAuth 2.0.
 * Reuses the existing OAuth pattern from google-connect.ts.
 */

import { renderSetupLayout } from './layout';

interface Step3Options {
  tenantId: string;
  connected: boolean;
  accountName?: string;
  error?: string;
}

/**
 * Render the Google connection step (step 3).
 */
export function renderStep3Google(options: Step3Options): string {
  const { tenantId, connected, accountName, error } = options;

  const content = `
    <div class="section-header">
      <h1 class="section-title">חיבור Google Business Profile</h1>
      <p class="section-subtitle">חברו את פרופיל העסק ב-Google בלחיצה אחת</p>
    </div>

    ${error ? `<div class="error-banner">${error}</div>` : ''}

    ${connected ? `
      <!-- Connected state -->
      <div class="connected-status">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div>
          <p class="connected-title">Google Business Profile מחובר!</p>
          ${accountName ? `<p class="connected-detail">${accountName}</p>` : ''}
        </div>
      </div>

      <form method="POST" action="/setup/step/3/continue">
        <input type="hidden" name="tenantId" value="${tenantId}">
        <button type="submit" class="btn-primary">
          המשך
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(180deg);">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </form>
    ` : `
      <!-- Not connected state -->
      <div class="google-info">
        <div class="info-icon">
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="google-logo">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </div>
        <div class="info-text">
          <h3>למה לחבר Google Business Profile?</h3>
          <ul>
            <li>ניהול וקבלת ביקורות במקום אחד</li>
            <li>מענה אוטומטי לביקורות עם AI</li>
            <li>התראות על ביקורות חדשות</li>
            <li>שיפור הנראות של העסק בחיפוש</li>
          </ul>
        </div>
      </div>

      <button type="button" class="btn-google" onclick="startGoogleOAuth()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        חבר Google
      </button>

      <div class="actions-footer">
        <a href="/setup/step/2?tenantId=${tenantId}" class="btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          חזרה
        </a>

        <form method="POST" action="/setup/step/3/skip" style="display: inline;">
          <input type="hidden" name="tenantId" value="${tenantId}">
          <button type="submit" class="btn-link">אין לי פרופיל עסקי - אדלג</button>
        </form>
      </div>
    `}

    <style>
      .error-banner {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
      }

      .connected-status {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        background: #dbeafe;
        border-radius: 12px;
        margin-bottom: 24px;
      }

      .connected-status svg {
        width: 32px;
        height: 32px;
        color: #2563eb;
        flex-shrink: 0;
      }

      .connected-title {
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 4px;
      }

      .connected-detail {
        font-size: 14px;
        color: #1d4ed8;
      }

      .google-info {
        display: flex;
        gap: 16px;
        padding: 20px;
        background: #eff6ff;
        border-radius: 12px;
        margin-bottom: 24px;
      }

      .info-icon {
        flex-shrink: 0;
      }

      .google-logo {
        width: 48px;
        height: 48px;
      }

      .info-text h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 8px;
      }

      .info-text ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .info-text li {
        font-size: 14px;
        color: #1d4ed8;
        padding: 4px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .info-text li::before {
        content: '';
        width: 6px;
        height: 6px;
        background: #3b82f6;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .btn-google {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 16px 24px;
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        margin-bottom: 24px;
      }

      .btn-google:hover {
        background: #3367d6;
      }

      .btn-google:active {
        transform: scale(0.98);
      }

      .actions-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
      }

      .btn-back {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #6b7280;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 12px;
        border-radius: 6px;
        transition: background 0.2s;
      }

      .btn-back:hover {
        background: #f3f4f6;
      }

      .btn-link {
        background: none;
        border: none;
        color: #6b7280;
        font-size: 14px;
        cursor: pointer;
        text-decoration: underline;
        padding: 8px;
      }

      .btn-link:hover {
        color: #374151;
      }

      .btn-primary {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    </style>

    <script>
      // Configuration
      window.FINDO_CONFIG = {
        tenantId: '${tenantId}'
      };

      // Start Google OAuth flow
      async function startGoogleOAuth() {
        showLoading('מתחבר ל-Google...');

        try {
          // Get auth URL from API
          const response = await fetch('/api/google/auth', {
            headers: {
              'X-Tenant-ID': window.FINDO_CONFIG.tenantId
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get auth URL');
          }

          const data = await response.json();

          if (data.authUrl) {
            // Redirect to Google OAuth
            window.location.href = data.authUrl;
          } else {
            throw new Error('No auth URL received');
          }
        } catch (error) {
          hideLoading();
          console.error('Error starting Google OAuth:', error);
          alert('Error: ' + error.message);
        }
      }
    </script>
  `;

  return renderSetupLayout({
    step: 3,
    title: 'חיבור Google',
    content,
  });
}
