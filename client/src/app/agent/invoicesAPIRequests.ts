import { requests } from "./agent";

const baseUrl = "finalinvoices";

export const InvoicesAPIRequest = {
  getFinalizedInvoices: (params: URLSearchParams) =>
    requests.get(`${baseUrl}`, params),

  getOneFinalizedInvoiceByFinalId: (invoiceFinalId: string) =>
    requests.get(`${baseUrl}/single-invoice?invoiceFinalId=${invoiceFinalId}`),

  getFinalizedInvoiceItems: (invoiceGkey: string) =>
    requests.get(`${baseUrl}/invoice-details?invoiceGkey=${invoiceGkey}`),

  getCtypeInvoiceFilters: () => requests.get(`${baseUrl}/filters-ctype`),

  getSTypeInvoiceFilters: () => requests.get(`${baseUrl}/filters-stype`),
  getSLFinalizedInvoiceItems: (invoiceGkey: number) =>
    requests.get(
      `${baseUrl}/invoice-details-s-type?invoiceGkey=${invoiceGkey}`
    ),
};
