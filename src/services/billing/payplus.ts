/**
 * PayPlus Payment Gateway Integration
 *
 * Implements PayPlus REST API for:
 * - Hosted payment page generation
 * - Token-based recurring billing
 * - Webhook signature verification
 *
 * PayPlus is an Israeli payment gateway supporting NIS transactions
 * with PCI DSS Level 1 compliance.
 */

import * as crypto from 'crypto';

// ============================================
// CONFIGURATION
// ============================================

export interface PayPlusConfig {
  apiKey: string;
  secretKey: string;
  terminalUid: string;
  sandbox: boolean;
}

const config: PayPlusConfig = {
  apiKey: process.env.PAYPLUS_API_KEY || '',
  secretKey: process.env.PAYPLUS_SECRET_KEY || '',
  terminalUid: process.env.PAYPLUS_TERMINAL_UID || '',
  sandbox: process.env.NODE_ENV !== 'production',
};

/**
 * Get PayPlus API base URL based on environment.
 */
function getBaseUrl(): string {
  return config.sandbox
    ? 'https://restapidev.payplus.co.il/api/v1.0'
    : 'https://restapi.payplus.co.il/api/v1.0';
}

/**
 * Get PayPlus auth headers.
 * PayPlus uses JSON-formatted Authorization header.
 */
function getAuthHeaders(): Record<string, string> {
  return {
    Authorization: JSON.stringify({
      api_key: config.apiKey,
      secret_key: config.secretKey,
    }),
    'Content-Type': 'application/json',
  };
}

// ============================================
// TYPES
// ============================================

/**
 * Charge method options for PayPlus payment pages.
 */
export enum ChargeMethod {
  /** Immediate charge, no token */
  CHARGE = 1,
  /** Create token only, no immediate charge */
  TOKEN_ONLY = 3,
  /** Create token AND charge immediately */
  TOKEN_AND_CHARGE = 5,
}

export interface CreatePaymentPageParams {
  /** Tenant ID for customer reference */
  tenantId: string;
  /** Amount in agorot (1 NIS = 100 agorot) */
  amount: number;
  /** Payment description */
  description: string;
  /** URL to redirect on success */
  successUrl: string;
  /** URL to redirect on failure */
  failureUrl: string;
  /** Webhook URL for payment notifications */
  callbackUrl: string;
  /** Charge method (default: TOKEN_AND_CHARGE for setup flow) */
  chargeMethod?: ChargeMethod;
  /** Customer email (optional) */
  customerEmail?: string;
  /** Customer name (optional) */
  customerName?: string;
}

export interface PaymentPageResponse {
  /** URL to redirect customer to hosted payment page */
  paymentPageUrl: string;
  /** Transaction UID for tracking */
  transactionUid: string;
}

export interface ChargeWithTokenParams {
  /** Token UID from initial payment */
  tokenUid: string;
  /** Amount in agorot */
  amount: number;
  /** Payment description */
  description?: string;
}

export interface ChargeWithTokenResponse {
  success: boolean;
  transactionUid: string;
  approvalNumber?: string;
  statusCode: string;
  errorMessage?: string;
}

export interface PayPlusWebhookPayload {
  /** Transaction UID */
  transaction_uid: string;
  /** Status code ('000' = approved) */
  status_code: string;
  /** Token UID (present if token created) */
  token_uid?: string;
  /** Approval number */
  approval_num?: string;
  /** Amount in agorot */
  amount: number;
  /** Currency code (376 = ILS) */
  currency_code: string;
  /** Customer info */
  customer?: {
    customer_uid: string;
    email?: string;
    name?: string;
  };
  /** Card info (last 4 digits only) */
  card_information?: {
    four_digits: string;
    brand_id?: string;
    brand_name?: string;
  };
  /** Additional info */
  more_info?: string;
  /** Error message if failed */
  status_description?: string;
}

// ============================================
// API METHODS
// ============================================

/**
 * Create a hosted payment page.
 *
 * Generates a URL to redirect the customer to PayPlus's hosted payment page.
 * After payment, customer is redirected to success/failure URL.
 * Payment confirmation comes via webhook callback.
 *
 * @param params - Payment page parameters
 * @returns Payment page URL and transaction UID
 */
export async function createPaymentPage(
  params: CreatePaymentPageParams
): Promise<PaymentPageResponse> {
  const url = `${getBaseUrl()}/PaymentPages/generateLink`;

  const body = {
    payment_page_uid: config.terminalUid,
    charge_method: params.chargeMethod ?? ChargeMethod.TOKEN_AND_CHARGE,
    amount: params.amount,
    currency_code: 'ILS',
    more_info: params.description,
    customer: {
      customer_uid: params.tenantId,
      email: params.customerEmail,
      name: params.customerName,
    },
    success_url: params.successUrl,
    failure_url: params.failureUrl,
    callback_url: params.callbackUrl,
    // Request token creation for recurring billing
    create_token: params.chargeMethod === ChargeMethod.TOKEN_ONLY ||
                  params.chargeMethod === ChargeMethod.TOKEN_AND_CHARGE,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[payplus] Failed to create payment page:', errorText);
    throw new Error(`PayPlus API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.data?.payment_page_link) {
    console.error('[payplus] Invalid response:', data);
    throw new Error('PayPlus did not return payment page URL');
  }

  return {
    paymentPageUrl: data.data.payment_page_link,
    transactionUid: data.data.transaction_uid,
  };
}

/**
 * Charge customer using saved token.
 *
 * Used for recurring monthly subscription charges.
 * Token is obtained from initial setup payment.
 *
 * @param params - Token charge parameters
 * @returns Charge result
 */
export async function chargeWithToken(
  params: ChargeWithTokenParams
): Promise<ChargeWithTokenResponse> {
  const url = `${getBaseUrl()}/Transactions/ChargeByToken`;

  const body = {
    token_uid: params.tokenUid,
    terminal_uid: config.terminalUid,
    amount: params.amount,
    currency_code: 'ILS',
    more_info: params.description || 'Findo monthly subscription',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[payplus] Token charge failed:', errorText);
    return {
      success: false,
      transactionUid: '',
      statusCode: response.status.toString(),
      errorMessage: errorText,
    };
  }

  const data = await response.json();

  // PayPlus status code '000' indicates approved
  const isApproved = data.data?.status_code === '000';

  return {
    success: isApproved,
    transactionUid: data.data?.transaction_uid || '',
    approvalNumber: data.data?.approval_num,
    statusCode: data.data?.status_code || 'unknown',
    errorMessage: isApproved ? undefined : data.data?.status_description,
  };
}

/**
 * Verify PayPlus webhook signature.
 *
 * PayPlus sends webhook notifications for payment events.
 * Signature must be verified before processing.
 *
 * IMPORTANT: Call with raw body BEFORE JSON parsing.
 *
 * @param rawBody - Raw request body as string or Buffer
 * @param signature - Signature header from PayPlus
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string
): boolean {
  const secretKey = config.secretKey;

  if (!secretKey) {
    console.error('[payplus] PAYPLUS_SECRET_KEY not configured');
    return false;
  }

  if (!signature) {
    console.warn('[payplus] Missing webhook signature');
    return false;
  }

  try {
    // PayPlus uses HMAC-SHA256 for webhook signatures
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    // Length mismatch throws in timingSafeEqual
    console.warn('[payplus] Signature verification error:', error);
    return false;
  }
}

/**
 * Check if PayPlus credentials are configured.
 */
export function isConfigured(): boolean {
  return !!(config.apiKey && config.secretKey && config.terminalUid);
}

/**
 * Get configuration status for debugging.
 */
export function getConfigStatus(): {
  configured: boolean;
  sandbox: boolean;
  hasApiKey: boolean;
  hasSecretKey: boolean;
  hasTerminalUid: boolean;
} {
  return {
    configured: isConfigured(),
    sandbox: config.sandbox,
    hasApiKey: !!config.apiKey,
    hasSecretKey: !!config.secretKey,
    hasTerminalUid: !!config.terminalUid,
  };
}

// Export configuration for external use
export { config };
