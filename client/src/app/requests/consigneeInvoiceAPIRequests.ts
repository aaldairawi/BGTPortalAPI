import { requests } from "../agent/agent";

const baseUrl = "finalconsigneeinvoices";

export const ConsigneeInvoiceAPIRequests= {
  getFinalizedInvoices: (params: URLSearchParams) =>
    requests.get(`${baseUrl}`, params),

  getFinalizedInvoiceItems: (invoiceGkey: string) =>
    requests.get(`${baseUrl}/invoice-details?invoiceGkey=${invoiceGkey}`),


    
};
