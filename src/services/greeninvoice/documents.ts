import { GreeninvoiceClient } from './index';
import { GreeninvoiceSearchResponse, DetectedInvoice } from './types';

/**
 * Fetch invoices from Greeninvoice since a given date.
 * Searches for document types 305 (Tax Invoice) and 320 (Invoice/Receipt).
 *
 * @param client - Authenticated Greeninvoice client
 * @param fromDate - Only return invoices created after this date
 * @param pageSize - Number of results per page (default 100)
 * @returns Array of detected invoices normalized for internal use
 */
export async function fetchInvoices(
  client: GreeninvoiceClient,
  fromDate: Date,
  pageSize: number = 100
): Promise<DetectedInvoice[]> {
  const response = await client.request<GreeninvoiceSearchResponse>(
    '/documents/search',
    {
      method: 'POST',
      body: JSON.stringify({
        type: [305, 320], // Tax Invoice and Invoice/Receipt
        fromDate: fromDate.toISOString().split('T')[0], // YYYY-MM-DD
        toDate: new Date().toISOString().split('T')[0],
        pageSize,
        sort: 'createdAt',
        sortType: 'desc',
      }),
    }
  );

  // Normalize to DetectedInvoice format
  return response.items.map((doc) => ({
    invoiceId: doc.id,
    invoiceNumber: doc.number,
    customerName: doc.client?.name || 'Unknown',
    customerPhone: doc.client?.phone || null,
    customerEmail: doc.client?.emails?.[0] || null,
    amount: doc.total,
    currency: doc.currency,
    createdAt: doc.createdAt,
    provider: 'greeninvoice' as const,
  }));
}
