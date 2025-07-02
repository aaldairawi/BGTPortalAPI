import { requests } from "../agent/agent";

export const SingleInvoicesAPIRequest = {
  getOneFinalizedInvoiceByFinalId: (invoiceFinalId: string) =>
    requests.get(
      `searchinvoices/search-invoice?invoiceFinalId=${invoiceFinalId}`
    ),
};
