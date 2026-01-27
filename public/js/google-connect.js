/**
 * Google OAuth Connection Client-Side Logic
 *
 * Initiates Google OAuth flow by fetching auth URL from backend.
 * Shows loading overlay during redirect.
 */

/**
 * Start Google OAuth flow.
 * Fetches auth URL from backend and redirects to Google.
 */
async function startGoogleOAuth() {
  const config = window.FINDO_CONFIG;

  if (!config.tenantId) {
    console.error('[google-connect] Tenant ID not configured');
    showErrorState('הגדרות המערכת חסרות. אנא פנו לתמיכה.');
    return;
  }

  // Show loading overlay
  showOverlay('מתחבר ל-Google...');

  // Disable connect button
  const connectBtn = document.getElementById('connectBtn');
  if (connectBtn) {
    connectBtn.disabled = true;
  }

  try {
    // Fetch auth URL from backend
    const response = await fetch('/api/google/auth', {
      method: 'GET',
      headers: {
        'X-Tenant-ID': config.tenantId
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'שגיאה בקבלת קישור ההתחברות');
    }

    if (!result.authUrl) {
      throw new Error('לא התקבל קישור התחברות מהשרת');
    }

    // Update overlay text before redirect
    updateOverlayText('מעבר ל-Google...');

    // Redirect to Google OAuth
    console.log('[google-connect] Redirecting to Google OAuth');
    window.location.href = result.authUrl;

  } catch (error) {
    console.error('[google-connect] Failed to start OAuth:', error);
    showErrorState(error.message || 'שגיאה בהתחלת תהליך ההתחברות');
  }
}

/**
 * Reset to initial state (for retry).
 */
function resetToInitial() {
  // Hide error and success states
  document.getElementById('errorState').classList.remove('visible');
  document.getElementById('successState').classList.remove('visible');

  // Show initial state
  document.getElementById('initialState').classList.remove('hidden');

  // Re-enable connect button
  const connectBtn = document.getElementById('connectBtn');
  if (connectBtn) {
    connectBtn.disabled = false;
  }
}

// ============================================================================
// UI State Functions
// ============================================================================

/**
 * Show loading overlay with message.
 */
function showOverlay(message) {
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlayText');

  if (overlayText) {
    overlayText.textContent = message || 'טוען...';
  }

  if (overlay) {
    overlay.classList.add('visible');
  }
}

/**
 * Update overlay text while visible.
 */
function updateOverlayText(message) {
  const overlayText = document.getElementById('overlayText');
  if (overlayText) {
    overlayText.textContent = message;
  }
}

/**
 * Hide loading overlay.
 */
function hideOverlay() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.remove('visible');
  }
}

/**
 * Show error state with message.
 */
function showErrorState(message) {
  hideOverlay();

  // Hide initial state
  document.getElementById('initialState').classList.add('hidden');

  // Update error message
  const errorMessageEl = document.getElementById('errorMessage');
  if (errorMessageEl) {
    errorMessageEl.textContent = message || 'אירעה שגיאה לא צפויה';
  }

  // Show error state
  document.getElementById('errorState').classList.add('visible');

  // Re-enable connect button (hidden but in case we switch back)
  const connectBtn = document.getElementById('connectBtn');
  if (connectBtn) {
    connectBtn.disabled = false;
  }
}
