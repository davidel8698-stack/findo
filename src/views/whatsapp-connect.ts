/**
 * WhatsApp Connection Page View
 *
 * Renders the WhatsApp Embedded Signup UI with Hebrew localization.
 * Provides connect button, loading overlay, and success/error states.
 */

interface WhatsAppConnectPageOptions {
  appId: string;
  configId: string;
  tenantId: string;
}

/**
 * Renders the WhatsApp connection page HTML.
 */
export function renderWhatsAppConnectPage(options: WhatsAppConnectPageOptions): string {
  const { appId, configId, tenantId } = options;

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>חיבור WhatsApp | Findo</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #075e54 0%, #128c7e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 420px;
      width: 100%;
      padding: 40px;
      text-align: center;
    }

    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
    }

    h1 {
      color: #075e54;
      font-size: 24px;
      margin-bottom: 12px;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .connect-btn {
      background: #25d366;
      color: white;
      border: none;
      padding: 16px 32px;
      font-size: 18px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s, transform 0.1s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .connect-btn:hover {
      background: #20bd5a;
    }

    .connect-btn:active {
      transform: scale(0.98);
    }

    .connect-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .connect-btn svg {
      width: 24px;
      height: 24px;
    }

    /* Loading overlay */
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .overlay.visible {
      display: flex;
    }

    .overlay-content {
      background: white;
      padding: 32px 48px;
      border-radius: 12px;
      text-align: center;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e0e0e0;
      border-top-color: #25d366;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .overlay-text {
      color: #333;
      font-size: 16px;
    }

    /* Success state */
    .success-state {
      display: none;
    }

    .success-state.visible {
      display: block;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: #25d366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .success-icon svg {
      width: 40px;
      height: 40px;
      color: white;
    }

    .success-title {
      color: #075e54;
      font-size: 22px;
      margin-bottom: 16px;
    }

    .success-details {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .success-details p {
      color: #333;
      font-size: 14px;
      margin: 8px 0;
    }

    .success-details strong {
      color: #075e54;
    }

    .done-btn {
      background: #075e54;
      color: white;
      border: none;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .done-btn:hover {
      background: #064d44;
    }

    /* Error state */
    .error-state {
      display: none;
    }

    .error-state.visible {
      display: block;
    }

    .error-icon {
      width: 80px;
      height: 80px;
      background: #dc3545;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .error-icon svg {
      width: 40px;
      height: 40px;
      color: white;
    }

    .error-title {
      color: #dc3545;
      font-size: 20px;
      margin-bottom: 16px;
    }

    .error-message {
      background: #fff5f5;
      border: 1px solid #ffe0e0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      color: #c53030;
      font-size: 14px;
    }

    .error-guidance {
      text-align: right;
      margin-bottom: 24px;
    }

    .error-guidance h3 {
      color: #333;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .error-guidance ul {
      color: #666;
      font-size: 13px;
      padding-right: 20px;
    }

    .error-guidance li {
      margin-bottom: 8px;
    }

    .retry-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .retry-btn:hover {
      background: #5a6268;
    }

    /* Initial state */
    .initial-state {
      display: block;
    }

    .initial-state.hidden {
      display: none;
    }

    .features {
      text-align: right;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .features h3 {
      color: #333;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .features ul {
      list-style: none;
    }

    .features li {
      color: #666;
      font-size: 13px;
      padding: 8px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .features li::before {
      content: '';
      width: 6px;
      height: 6px;
      background: #25d366;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Initial state - connect button -->
    <div class="initial-state" id="initialState">
      <!-- WhatsApp logo SVG -->
      <svg class="logo" viewBox="0 0 175.216 175.552" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="whatsapp-gradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stop-color="#20b038"/>
            <stop offset="100%" stop-color="#60d66a"/>
          </linearGradient>
        </defs>
        <path fill="url(#whatsapp-gradient)" d="M87.184 14.919c-39.86 0-72.249 32.391-72.265 72.25-.006 12.778 3.335 25.26 9.686 36.29l-10.296 37.61 38.507-10.1c10.612 5.787 22.564 8.84 34.708 8.845h.03c39.859 0 72.253-32.396 72.269-72.259.008-19.31-7.5-37.462-21.128-51.11-13.627-13.648-31.766-21.165-51.11-21.177-.26-.04-.421-.05-.401-.05z"/>
        <path fill="#fff" d="M131.688 43.548c-11.9-11.9-27.724-18.45-44.577-18.457h-.026c-34.787 0-63.102 28.312-63.115 63.1-.004 11.125 2.903 21.997 8.435 31.593L24.5 150.3l31.54-8.273c9.227 5.035 19.617 7.69 30.202 7.694h.026c34.782 0 63.1-28.316 63.115-63.105.008-16.863-6.542-32.697-18.446-44.577l-.25-.49zm-44.577 97.007h-.021c-9.413-.004-18.64-2.532-26.674-7.31l-1.913-1.135-19.825 5.2 5.289-19.32-1.246-1.981c-5.26-8.364-8.04-18.03-8.035-27.94.01-28.938 23.553-52.477 52.488-52.477 14.022.007 27.2 5.47 37.112 15.398 9.912 9.928 15.371 23.12 15.365 37.152-.014 28.949-23.558 52.492-52.482 52.492l-.058-.08z"/>
        <path fill="#fff" d="M120.048 102.988c-1.765-.882-10.44-5.15-12.052-5.74-1.614-.588-2.788-.882-3.962.883-1.176 1.764-4.551 5.739-5.579 6.913-1.027 1.175-2.055 1.323-3.82.44-1.764-.882-7.449-2.746-14.185-8.76-5.245-4.68-8.786-10.46-9.814-12.225-.882-1.618-.046-2.598.809-3.48.768-.793 1.765-2.056 2.647-3.082.882-1.028 1.175-1.765 1.763-2.94.588-1.176.294-2.206-.147-3.088-.44-.883-3.962-9.55-5.431-13.077-1.43-3.434-2.883-2.97-3.962-3.023-1.027-.05-2.202-.061-3.377-.061-1.174 0-3.085.44-4.699 2.206-1.614 1.764-6.165 6.027-6.165 14.695 0 8.67 6.312 17.044 7.193 18.22.882 1.175 12.425 18.972 30.103 26.61 4.204 1.814 7.488 2.898 10.046 3.71 4.221 1.342 8.063 1.152 11.098.698 3.385-.505 10.44-4.269 11.912-8.393 1.47-4.124 1.47-7.66 1.027-8.394-.44-.735-1.615-1.176-3.38-2.058l.008-.053z"/>
      </svg>

      <h1>חיבור WhatsApp לעסק</h1>
      <p class="subtitle">
        חברו את מספר הווטסאפ של העסק שלכם כדי לקבל הודעות מלקוחות ולתת מענה אוטומטי 24/7
      </p>

      <button class="connect-btn" id="connectBtn" onclick="launchWhatsAppSignup()">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        התחברות עם WhatsApp
      </button>

      <div class="features">
        <h3>מה תקבלו אחרי החיבור:</h3>
        <ul>
          <li>קבלת הודעות מלקוחות ישירות למערכת</li>
          <li>מענה אוטומטי בזמנים מוגדרים מראש</li>
          <li>שליחת עדכונים והתראות ללקוחות</li>
          <li>ניהול שיחות מרוכז במקום אחד</li>
        </ul>
      </div>
    </div>

    <!-- Success state -->
    <div class="success-state" id="successState">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 class="success-title">WhatsApp מחובר בהצלחה!</h2>
      <div class="success-details">
        <p><strong>מספר טלפון:</strong> <span id="connectedPhone">-</span></p>
        <p><strong>שם העסק:</strong> <span id="connectedBusiness">-</span></p>
      </div>
      <button class="done-btn" onclick="window.location.href='/'">סיום</button>
    </div>

    <!-- Error state -->
    <div class="error-state" id="errorState">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <h2 class="error-title">שגיאה בחיבור WhatsApp</h2>
      <div class="error-message" id="errorMessage">אירעה שגיאה לא צפויה</div>
      <div class="error-guidance">
        <h3>מה ניתן לנסות:</h3>
        <ul>
          <li>ודאו שיש לכם הרשאות ניהול בחשבון הפייסבוק העסקי</li>
          <li>בדקו שמספר הווטסאפ לא מחובר למערכת אחרת</li>
          <li>נסו להתנתק ולהתחבר מחדש לפייסבוק</li>
          <li>אם הבעיה נמשכת, פנו לתמיכה</li>
        </ul>
      </div>
      <button class="retry-btn" onclick="resetToInitial()">נסו שוב</button>
    </div>
  </div>

  <!-- Loading overlay -->
  <div class="overlay" id="overlay">
    <div class="overlay-content">
      <div class="spinner"></div>
      <p class="overlay-text" id="overlayText">מחבר את WhatsApp...</p>
    </div>
  </div>

  <!-- Facebook SDK -->
  <script async defer crossorigin="anonymous"
    src="https://connect.facebook.net/he_IL/sdk.js"
    id="facebook-jssdk">
  </script>

  <!-- Configuration -->
  <script>
    window.FINDO_CONFIG = {
      appId: '${appId}',
      configId: '${configId}',
      tenantId: '${tenantId}'
    };
  </script>

  <!-- WhatsApp Signup Logic -->
  <script src="/js/whatsapp-signup.js"></script>
</body>
</html>`;
}
