/**
 * Step 2: WhatsApp Connection
 *
 * Connects WhatsApp Business using Meta Embedded Signup.
 * Reuses the existing SDK pattern from whatsapp-connect.ts.
 */

import { renderSetupLayout } from './layout';

interface Step2Options {
  tenantId: string;
  appId: string;      // META_APP_ID
  configId: string;   // META_CONFIG_ID
  connected: boolean; // Whether already connected
  phoneNumber?: string;
  businessName?: string;
  error?: string;
}

/**
 * Render the WhatsApp connection step (step 2).
 */
export function renderStep2WhatsApp(options: Step2Options): string {
  const { tenantId, appId, configId, connected, phoneNumber, businessName, error } = options;

  const content = `
    <div class="section-header">
      <h1 class="section-title">חיבור WhatsApp</h1>
      <p class="section-subtitle">חברו את מספר WhatsApp העסקי שלכם בלחיצה אחת</p>
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
          <p class="connected-title">WhatsApp מחובר!</p>
          ${phoneNumber ? `<p class="connected-detail">${phoneNumber}</p>` : ''}
          ${businessName ? `<p class="connected-detail">${businessName}</p>` : ''}
        </div>
      </div>

      <form method="POST" action="/setup/step/2/continue">
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
      <div class="whatsapp-info">
        <div class="info-icon">
          <svg viewBox="0 0 175.216 175.552" xmlns="http://www.w3.org/2000/svg" class="whatsapp-logo">
            <defs>
              <linearGradient id="whatsapp-gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stop-color="#20b038"/>
                <stop offset="100%" stop-color="#60d66a"/>
              </linearGradient>
            </defs>
            <path fill="url(#whatsapp-gradient)" d="M87.184 14.919c-39.86 0-72.249 32.391-72.265 72.25-.006 12.778 3.335 25.26 9.686 36.29l-10.296 37.61 38.507-10.1c10.612 5.787 22.564 8.84 34.708 8.845h.03c39.859 0 72.253-32.396 72.269-72.259.008-19.31-7.5-37.462-21.128-51.11-13.627-13.648-31.766-21.165-51.11-21.177-.26-.04-.421-.05-.401-.05z"/>
            <path fill="#fff" d="M131.688 43.548c-11.9-11.9-27.724-18.45-44.577-18.457h-.026c-34.787 0-63.102 28.312-63.115 63.1-.004 11.125 2.903 21.997 8.435 31.593L24.5 150.3l31.54-8.273c9.227 5.035 19.617 7.69 30.202 7.694h.026c34.782 0 63.1-28.316 63.115-63.105.008-16.863-6.542-32.697-18.446-44.577l-.25-.49z"/>
          </svg>
        </div>
        <div class="info-text">
          <h3>למה לחבר WhatsApp?</h3>
          <ul>
            <li>שליחת הודעות ללקוחות שלא הצלחתם לענות להם</li>
            <li>קבלת עדכונים על פניות חדשות</li>
            <li>מענה אוטומטי 24/7</li>
          </ul>
        </div>
      </div>

      <button type="button" class="btn-whatsapp" onclick="launchWhatsAppSignup()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        חבר WhatsApp
      </button>

      <div class="actions-footer">
        <a href="/setup/step/1?tenantId=${tenantId}" class="btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          חזרה
        </a>

        <form method="POST" action="/setup/step/2/skip" style="display: inline;">
          <input type="hidden" name="tenantId" value="${tenantId}">
          <button type="submit" class="btn-link">אין לי WhatsApp עסקי - אדלג</button>
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
        background: #d1fae5;
        border-radius: 12px;
        margin-bottom: 24px;
      }

      .connected-status svg {
        width: 32px;
        height: 32px;
        color: #10b981;
        flex-shrink: 0;
      }

      .connected-title {
        font-weight: 600;
        color: #065f46;
        margin-bottom: 4px;
      }

      .connected-detail {
        font-size: 14px;
        color: #047857;
      }

      .whatsapp-info {
        display: flex;
        gap: 16px;
        padding: 20px;
        background: #f0fdf4;
        border-radius: 12px;
        margin-bottom: 24px;
      }

      .info-icon {
        flex-shrink: 0;
      }

      .whatsapp-logo {
        width: 48px;
        height: 48px;
      }

      .info-text h3 {
        font-size: 16px;
        font-weight: 600;
        color: #166534;
        margin-bottom: 8px;
      }

      .info-text ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .info-text li {
        font-size: 14px;
        color: #15803d;
        padding: 4px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .info-text li::before {
        content: '';
        width: 6px;
        height: 6px;
        background: #22c55e;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .btn-whatsapp {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 16px 24px;
        background: #25d366;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        margin-bottom: 24px;
      }

      .btn-whatsapp:hover {
        background: #20bd5a;
      }

      .btn-whatsapp:active {
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

    <!-- Facebook SDK for Embedded Signup -->
    <script async defer crossorigin="anonymous"
      src="https://connect.facebook.net/he_IL/sdk.js"
      id="facebook-jssdk">
    </script>

    <script>
      // Configuration for WhatsApp Embedded Signup
      window.FINDO_CONFIG = {
        appId: '${appId}',
        configId: '${configId}',
        tenantId: '${tenantId}'
      };

      // Initialize Facebook SDK
      window.fbAsyncInit = function() {
        FB.init({
          appId: window.FINDO_CONFIG.appId,
          cookie: true,
          xfbml: true,
          version: 'v21.0'
        });
      };

      // Launch WhatsApp Embedded Signup flow
      function launchWhatsAppSignup() {
        if (typeof FB === 'undefined') {
          alert('Facebook SDK not loaded. Please refresh the page.');
          return;
        }

        showLoading('מחבר WhatsApp...');

        FB.login(function(response) {
          if (response.authResponse) {
            // User completed signup, get session info
            const code = response.authResponse.code;

            // Get session info callback
            window.sessionInfoListener = function(event) {
              if (!event.data || !event.data.type) return;
              if (event.data.type !== 'WA_EMBEDDED_SIGNUP') return;

              const data = event.data.data;
              if (data && data.phone_number_id) {
                // Send data to backend
                handleSignupComplete({
                  code: code,
                  wabaId: data.waba_id,
                  phoneNumberId: data.phone_number_id,
                  displayPhoneNumber: data.display_phone_number || '',
                  businessName: data.current_step || ''
                });
              }
            };

            window.addEventListener('message', window.sessionInfoListener);
          } else {
            hideLoading();
            console.log('User cancelled WhatsApp signup');
          }
        }, {
          config_id: window.FINDO_CONFIG.configId,
          response_type: 'code',
          override_default_response_type: true,
          extras: {
            setup: {},
            featureType: '',
            sessionInfoVersion: 3
          }
        });
      }

      // Handle successful signup
      async function handleSignupComplete(data) {
        try {
          const response = await fetch('/api/whatsapp/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Tenant-ID': window.FINDO_CONFIG.tenantId
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();

          if (result.success) {
            // Redirect to callback handler
            window.location.href = '/setup/step/2/callback?success=true&tenantId=' + window.FINDO_CONFIG.tenantId;
          } else {
            hideLoading();
            alert('Error: ' + (result.error || 'Unknown error'));
          }
        } catch (error) {
          hideLoading();
          console.error('Error completing WhatsApp signup:', error);
          alert('Error connecting WhatsApp. Please try again.');
        }

        // Remove event listener
        if (window.sessionInfoListener) {
          window.removeEventListener('message', window.sessionInfoListener);
        }
      }
    </script>
  `;

  return renderSetupLayout({
    step: 2,
    title: 'חיבור WhatsApp',
    content,
  });
}
