export interface InvoicePendingUploadDto {
  finalInvoiceNumber: string;
  finalizedDate: string;
  currency: string;
  invoiceType: string;
  customer: string;
  invoiceTotal: number;
}

export interface InvoiceHeaderDto {
  id: number;
  finalInvoiceNumber: string;
  finalizedDate: string;
  uploadedDate: string;
  uploadedByName: string;
  currency: string;
  invoiceType: string;
  profitCenter: string;
  invoiceTotal: number;
}
