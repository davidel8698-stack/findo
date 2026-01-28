/**
 * iCount API credentials stored in token vault.
 */
export interface IcountCredentials {
  companyId: string;  // Company ID (cid)
  username: string;   // User login
  password: string;   // User password
}

/**
 * iCount session response from /api/login endpoint.
 */
export interface IcountLoginResponse {
  status: 'ok' | 'error';
  sid?: string;   // Session ID (only if status='ok')
  reason?: string; // Error reason (only if status='error')
}

/**
 * iCount document from doc_search response.
 * Document types: invoice, invrec (invoice+receipt), receipt, refund, order, offer, delivery, deal
 */
export interface IcountDocument {
  docnum: string;      // Document number
  doctype: string;     // 'invoice', 'invrec', etc.
  docdate: string;     // Document date (YYYY-MM-DD)
  total: number;       // Total amount
  client_name?: string;
  client_phone?: string;
  client_email?: string;
}

/**
 * iCount doc_search response.
 */
export interface IcountSearchResponse {
  status: 'ok' | 'error';
  docs?: IcountDocument[];
  reason?: string;
}

/**
 * Re-export DetectedInvoice for use across providers.
 * Using same type as Greeninvoice for consistency.
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
