/**
 * Google Connection Page View
 *
 * Renders the Google Business Profile connection UI with Hebrew localization.
 * Provides connect button, loading overlay, and success/error states.
 */

interface GoogleConnectPageOptions {
  tenantId: string;
  state?: 'initial' | 'success' | 'error';
  businessName?: string;
  errorMessage?: string;
}

/**
 * Renders the Google connection page HTML.
 */
export function renderGoogleConnectPage(options: GoogleConnectPageOptions): string {
  const { tenantId, state = 'initial', businessName, errorMessage } = options;

  // Determine which state to show
  const initialVisible = state === 'initial';
  const successVisible = state === 'success';
  const errorVisible = state === 'error';

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>חיבור Google Business Profile | Findo</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #4285F4 0%, #34A853 100%);
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
      color: #4285F4;
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
      background: #4285F4;
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
      background: #3367d6;
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
      border-top-color: #4285F4;
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
      background: #34A853;
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
      color: #34A853;
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
      color: #4285F4;
    }

    .done-btn {
      background: #4285F4;
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
      background: #3367d6;
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
      background: #EA4335;
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
      color: #EA4335;
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
      background: #4285F4;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Initial state - connect button -->
    <div class="initial-state${initialVisible ? '' : ' hidden'}" id="initialState">
      <!-- Google Business Profile logo SVG -->
      <svg class="logo" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>

      <h1>חיבור Google Business Profile</h1>
      <p class="subtitle">
        חברו את הפרופיל העסקי שלכם ב-Google כדי לנהל ביקורות ולהגיב להן אוטומטית
      </p>

      <button class="connect-btn" id="connectBtn" onclick="startGoogleOAuth()">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        התחברות עם Google
      </button>

      <div class="features">
        <h3>מה תקבלו אחרי החיבור:</h3>
        <ul>
          <li>צפייה בכל הביקורות של העסק במקום אחד</li>
          <li>התראות על ביקורות חדשות</li>
          <li>מענה אוטומטי לביקורות עם AI</li>
          <li>ניהול הפרופיל העסקי שלכם ב-Google</li>
        </ul>
      </div>
    </div>

    <!-- Success state -->
    <div class="success-state${successVisible ? ' visible' : ''}" id="successState">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 class="success-title">Google Business Profile מחובר בהצלחה!</h2>
      <div class="success-details">
        <p><strong>שם העסק:</strong> <span id="connectedBusiness">${businessName || '-'}</span></p>
      </div>
      <button class="done-btn" onclick="window.location.href='/'">סיום</button>
    </div>

    <!-- Error state -->
    <div class="error-state${errorVisible ? ' visible' : ''}" id="errorState">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <h2 class="error-title">שגיאה בחיבור Google</h2>
      <div class="error-message" id="errorMessage">${errorMessage || 'אירעה שגיאה לא צפויה'}</div>
      <div class="error-guidance">
        <h3>מה ניתן לנסות:</h3>
        <ul>
          <li>ודאו שיש לכם פרופיל עסקי מאומת ב-Google Business Profile</li>
          <li>בדקו שיש לכם הרשאות ניהול לפרופיל העסקי</li>
          <li>נסו להתנתק ולהתחבר מחדש לחשבון Google</li>
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
      <p class="overlay-text" id="overlayText">מתחבר ל-Google...</p>
    </div>
  </div>

  <!-- Configuration -->
  <script>
    window.FINDO_CONFIG = {
      tenantId: '${tenantId}'
    };
  </script>

  <!-- Google Connect Logic -->
  <script src="/js/google-connect.js"></script>
</body>
</html>`;
}
