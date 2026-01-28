/**
 * Greeninvoice API credentials stored in token vault.
 */
export interface GreeninvoiceCredentials {
  id: string;      // API Key ID
  secret: string;  // API Key Secret
}

/**
 * Greeninvoice document (invoice) from API response.
 * Document types per API:
 * - 300: Proforma Invoice
 * - 305: Tax Invoice (main type we want)
 * - 320: Invoice/Receipt
 * - 400: Receipt
 */
export interface GreeninvoiceDocument {
  id: string;
  number: string;
  type: number;  // 305 for tax invoice, 320 for invoice/receipt
  createdAt: string;
  total: number;
  currency: string;
  client?: {
    name?: string;
    phone?: string;
    emails?: string[];
  };
}

/**
 * Search response from /documents/search endpoint.
 */
export interface GreeninvoiceSearchResponse {
  items: GreeninvoiceDocument[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Token response from /account/token endpoint.
 */
export interface GreeninvoiceTokenResponse {
  token: string;
  expiresIn: number; // seconds, typically 3600 (1 hour)
}

/**
 * Normalized invoice for internal use across providers.
 */
export interface DetectedInvoice {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  amount: number;
  currency: string;
  createdAt: string;
  provider: 'greeninvoice' | 'icount';
}
