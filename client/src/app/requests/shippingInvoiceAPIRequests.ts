import { requests } from "../agent/agent";

const baseUrl = "finalshippinglineinvoices";

export const ShippingLineInvoiceAPIRequests = {
  getSLInvoiceByFinalNumber: (finalizedDate: string) =>
    requests.get(`${baseUrl}/shippingline?finalizedDate=${finalizedDate}`),

  getSLParentAndPartnerInvoiceItems: (invoiceGkey: string) =>
    requests.get(
      `${baseUrl}/shipping-line-parent-partner-invoice-details?invoiceGkey=${invoiceGkey}`
    ),
};
