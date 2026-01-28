import type { IcountClient } from './index';
import { IcountSearchResponse, DetectedInvoice } from './types';

/**
 * Fetch invoices from iCount since a given date.
 * Searches for document types 'invoice' and 'invrec' (invoice+receipt).
 *
 * @param client - Authenticated iCount client (must have called login())
 * @param fromDate - Only return invoices created after this date
 * @returns Array of detected invoices normalized for internal use
 */
export async function fetchInvoices(
  client: IcountClient,
  fromDate: Date
): Promise<DetectedInvoice[]> {
  const response = await client.request<IcountSearchResponse>('/api/doc_search', {
    doctype: 'invoice,invrec', // Both invoice types
    from_date: fromDate.toISOString().split('T')[0], // YYYY-MM-DD
    to_date: new Date().toISOString().split('T')[0],
  });

  // Handle empty response
  if (!response.docs || response.docs.length === 0) {
    return [];
  }

  // Normalize to DetectedInvoice format
  return response.docs.map((doc) => ({
    invoiceId: doc.docnum,
    invoiceNumber: doc.docnum,
    customerName: doc.client_name || 'Unknown',
    customerPhone: doc.client_phone || null,
    customerEmail: doc.client_email || null,
    amount: doc.total,
    currency: 'ILS', // iCount is Israeli, always ILS
    createdAt: doc.docdate,
    provider: 'icount' as const,
  }));
}
