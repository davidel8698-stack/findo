/**
 * WhatsApp Embedded Signup Client-Side Logic
 *
 * Integrates with Meta Facebook SDK to handle WhatsApp Business API signup.
 * Sends credentials to /api/whatsapp/callback after successful signup.
 */

// Initialize Facebook SDK when ready
window.fbAsyncInit = function() {
  FB.init({
    appId: window.FINDO_CONFIG.appId,
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v21.0'
  });
  console.log('[whatsapp-signup] Facebook SDK initialized');
};

/**
 * Launch WhatsApp Embedded Signup popup.
 * Triggered when user clicks "Connect WhatsApp" button.
 */
function launchWhatsAppSignup() {
  // Show loading overlay
  showOverlay('פותח חלון התחברות...');

  // Disable connect button
  const connectBtn = document.getElementById('connectBtn');
  if (connectBtn) {
    connectBtn.disabled = true;
  }

  // Launch Facebook Login with WhatsApp Business Management permissions
  FB.login(
    function(response) {
      if (response.authResponse) {
        console.log('[whatsapp-signup] Auth response received');
        handleAuthResponse(response);
      } else {
        console.log('[whatsapp-signup] User cancelled or failed to authorize');
        handleSignupCancelled();
      }
    },
    {
      config_id: window.FINDO_CONFIG.configId,
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: '',
        sessionInfoVersion: '3'
      }
    }
  );
}

/**
 * Handle successful authentication response from FB.login.
 */
function handleAuthResponse(response) {
  const authCode = response.authResponse.code;

  if (!authCode) {
    showErrorState('לא התקבל קוד הרשאה מפייסבוק');
    return;
  }

  // Update overlay text
  updateOverlayText('מאמת פרטים...');

  // Get session info from the embedded signup
  // Note: In production, FB.login with config_id returns sessionInfoVersion data
  // The phone number ID and WABA ID come from the onSuccess callback payload
  // For now, we extract from the response or prompt user

  // Check if we got the extended session info
  const sessionInfo = response.authResponse;

  // Extract WhatsApp-specific data if available
  // sessionInfoVersion: '3' provides phone_number_id, waba_id
  let wabaId = sessionInfo.waba_id || '';
  let phoneNumberId = sessionInfo.phone_number_id || '';
  let displayPhoneNumber = sessionInfo.display_phone_number || '';
  let businessName = sessionInfo.business_name || '';

  // If session info not directly available, it may come via callback
  // Meta sends this data via the message event for embedded signup
  if (!wabaId || !phoneNumberId) {
    console.log('[whatsapp-signup] Session info not in authResponse, waiting for message event');
    // Session info will be captured by the message event listener below
    // Store the auth code for when we receive the session info
    window.pendingAuthCode = authCode;
    return;
  }

  // Send credentials to backend
  handleSignupSuccess({
    code: authCode,
    wabaId: wabaId,
    phoneNumberId: phoneNumberId,
    displayPhoneNumber: displayPhoneNumber,
    businessName: businessName
  });
}

/**
 * Listen for messages from Meta's Embedded Signup iframe.
 * This receives the actual WABA and phone number IDs.
 */
window.addEventListener('message', function(event) {
  // Only accept messages from Facebook
  if (event.origin !== 'https://www.facebook.com' &&
      event.origin !== 'https://web.facebook.com') {
    return;
  }

  try {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

    // Handle WhatsApp Embedded Signup session info
    if (data.type === 'WA_EMBEDDED_SIGNUP') {
      console.log('[whatsapp-signup] Received WA_EMBEDDED_SIGNUP message:', data);

      if (data.event === 'FINISH') {
        const sessionInfo = data.data;
        const authCode = window.pendingAuthCode;

        if (!authCode) {
          console.error('[whatsapp-signup] No pending auth code for session info');
          return;
        }

        // Clear pending auth code
        window.pendingAuthCode = null;

        handleSignupSuccess({
          code: authCode,
          wabaId: sessionInfo.waba_id || '',
          phoneNumberId: sessionInfo.phone_number_id || '',
          displayPhoneNumber: sessionInfo.display_phone_number || '',
          businessName: sessionInfo.business_name || ''
        });
      } else if (data.event === 'CANCEL') {
        handleSignupCancelled();
      } else if (data.event === 'ERROR') {
        showErrorState(data.data?.error_message || 'שגיאה בתהליך ההרשמה');
      }
    }
  } catch (e) {
    // Not a JSON message, ignore
  }
});

/**
 * Send signup credentials to backend.
 */
async function handleSignupSuccess(data) {
  updateOverlayText('שומר פרטי חיבור...');

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

    if (!response.ok) {
      throw new Error(result.error || 'שגיאה בשמירת פרטי החיבור');
    }

    console.log('[whatsapp-signup] Connection saved successfully:', result);

    // Show success state
    showSuccessState({
      phoneNumber: data.displayPhoneNumber || data.phoneNumberId,
      businessName: data.businessName || 'העסק שלך'
    });

  } catch (error) {
    console.error('[whatsapp-signup] Failed to save connection:', error);
    showErrorState(error.message || 'שגיאה בשמירת פרטי החיבור');
  }
}

/**
 * Handle user cancelling the signup flow.
 */
function handleSignupCancelled() {
  console.log('[whatsapp-signup] Signup cancelled');
  hideOverlay();

  // Re-enable connect button
  const connectBtn = document.getElementById('connectBtn');
  if (connectBtn) {
    connectBtn.disabled = false;
  }

  // Clear any pending auth code
  window.pendingAuthCode = null;
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

  // Clear any pending data
  window.pendingAuthCode = null;
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
 * Show success state with connection details.
 */
function showSuccessState(details) {
  hideOverlay();

  // Hide initial state
  document.getElementById('initialState').classList.add('hidden');

  // Update success details
  const phoneEl = document.getElementById('connectedPhone');
  const businessEl = document.getElementById('connectedBusiness');

  if (phoneEl) {
    phoneEl.textContent = details.phoneNumber || '-';
  }

  if (businessEl) {
    businessEl.textContent = details.businessName || '-';
  }

  // Show success state
  document.getElementById('successState').classList.add('visible');
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
}
