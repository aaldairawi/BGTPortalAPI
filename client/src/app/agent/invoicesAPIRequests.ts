import { requests } from "./agent";

export const InvoicesAPIRequest = {
  loadInvoiceTypes: () => requests.get(""),

  getFinalizedInvoices: (params: URLSearchParams) =>
    requests.get("finalinvoices", params),
  getOneFinalizedInvoiceByFinalId: (invoiceFinalId: string) =>
    requests.get(`finalinvoices/${invoiceFinalId}`),
  getFinalizedInvoiceItems: (invoiceGkey: string) =>
    requests.get(`finalinvoices/invoiceitems?invoiceGkey=${invoiceGkey}`),
  getInvoiceFilters: () => requests.get("finalinvoices/filters"),

};
