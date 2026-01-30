/**
 * Setup Wizard Layout
 *
 * Shared layout for the 5-step setup wizard with Hebrew RTL support.
 * Provides progress indicator and consistent styling across all steps.
 */

interface SetupLayoutOptions {
  step: number;        // Current step (1-5)
  title: string;       // Page title
  content: string;     // Step content HTML
  totalSteps?: number; // Total steps (default 5)
}

/**
 * Render the setup wizard layout.
 *
 * @param options - Layout configuration
 * @returns Full HTML page string
 */
export function renderSetupLayout(options: SetupLayoutOptions): string {
  const { step, title, content, totalSteps = 5 } = options;

  // Generate step indicators
  const stepIndicators = Array.from({ length: totalSteps }, (_, i) => {
    const stepNum = i + 1;
    const isCompleted = stepNum < step;
    const isCurrent = stepNum === step;
    const isUpcoming = stepNum > step;

    // Step names in Hebrew
    const stepNames = [
      'פרטי עסק',     // Business info
      'WhatsApp',     // WhatsApp
      'Google',       // Google
      'טלפוניה',      // Telephony
      'תשלום',        // Payment
    ];

    const stepName = stepNames[i] || `שלב ${stepNum}`;

    let stepClass = 'step';
    let iconContent = '';

    if (isCompleted) {
      stepClass += ' completed';
      iconContent = `<svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`;
    } else if (isCurrent) {
      stepClass += ' current';
      iconContent = `<span class="step-number">${stepNum}</span>`;
    } else {
      stepClass += ' upcoming';
      iconContent = `<span class="step-number">${stepNum}</span>`;
    }

    return `
      <div class="${stepClass}">
        <div class="step-circle">
          ${iconContent}
        </div>
        <span class="step-name">${stepName}</span>
      </div>
      ${stepNum < totalSteps ? '<div class="step-line"></div>' : ''}
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Findo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    /* Logo area */
    .logo {
      color: white;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 24px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Progress indicator */
    .progress-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 24px;
      width: 100%;
      max-width: 600px;
      padding: 0 16px;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .step-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .step.completed .step-circle {
      background: #10b981;
      color: white;
    }

    .step.current .step-circle {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .step.upcoming .step-circle {
      background: rgba(255,255,255,0.3);
      color: white;
    }

    .step-name {
      font-size: 12px;
      color: rgba(255,255,255,0.9);
      white-space: nowrap;
    }

    .step.current .step-name {
      font-weight: 600;
      color: white;
    }

    .step.upcoming .step-name {
      color: rgba(255,255,255,0.6);
    }

    .step-number {
      font-size: 16px;
    }

    .check-icon {
      width: 20px;
      height: 20px;
    }

    .step-line {
      flex: 1;
      height: 2px;
      background: rgba(255,255,255,0.3);
      margin: 0 8px;
      margin-bottom: 24px; /* Align with circles */
      min-width: 20px;
      max-width: 60px;
    }

    /* Main container */
    .main-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 100%;
      padding: 32px;
    }

    /* Form styles */
    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-label.required::after {
      content: ' *';
      color: #ef4444;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .form-select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      background: white;
      cursor: pointer;
    }

    .form-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      resize: vertical;
      min-height: 80px;
    }

    .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-hint {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }

    .form-error {
      font-size: 12px;
      color: #ef4444;
      margin-top: 4px;
    }

    /* Primary button */
    .btn-primary {
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.2s;
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:active {
      transform: scale(0.98);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Secondary button */
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: transparent;
      color: #6b7280;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    /* Link button (skip) */
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

    /* Loading overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .loading-overlay.visible {
      display: flex;
    }

    .loading-content {
      background: white;
      padding: 32px;
      border-radius: 12px;
      text-align: center;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e7eb;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      color: #374151;
      font-size: 16px;
    }

    /* Connected status */
    .connected-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #d1fae5;
      border-radius: 8px;
      color: #065f46;
      margin-bottom: 16px;
    }

    .connected-status svg {
      width: 20px;
      height: 20px;
      color: #10b981;
    }

    /* Section header */
    .section-header {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .section-subtitle {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .progress-container {
        gap: 0;
        padding: 0 8px;
      }

      .step-name {
        font-size: 10px;
      }

      .step-circle {
        width: 32px;
        height: 32px;
        font-size: 14px;
      }

      .step-line {
        min-width: 10px;
      }

      .main-container {
        padding: 24px 16px;
      }
    }
  </style>
</head>
<body>
  <!-- Logo -->
  <div class="logo">Findo</div>

  <!-- Progress indicator -->
  <div class="progress-container">
    ${stepIndicators}
  </div>

  <!-- Main content container -->
  <div class="main-container">
    ${content}
  </div>

  <!-- Loading overlay -->
  <div class="loading-overlay" id="loadingOverlay">
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="loading-text" id="loadingText">טוען...</p>
    </div>
  </div>

  <script>
    // Loading overlay functions
    function showLoading(text) {
      document.getElementById('loadingText').textContent = text || 'טוען...';
      document.getElementById('loadingOverlay').classList.add('visible');
    }

    function hideLoading() {
      document.getElementById('loadingOverlay').classList.remove('visible');
    }
  </script>
</body>
</html>`;
}
