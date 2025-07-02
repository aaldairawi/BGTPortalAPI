import { requests } from "../agent/agent";

const baseUrl = "invoicefilters";

export const InvoiceFiltersAPIRequest = {
  getCtypeInvoiceFilters: () => requests.get(`${baseUrl}/filters-ctype`),

  getSTypeInvoiceFilters: () => requests.get(`${baseUrl}/filters-stype`),
};
