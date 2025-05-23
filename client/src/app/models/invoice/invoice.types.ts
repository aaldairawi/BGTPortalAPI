export interface FinalInvoiceResponseDto {
  invoiceId: string;
  invoices: FinalizedInvoiceDto[];
  invoicesLength: number;
}
export interface FinalizedInvoiceDto {
  id: number;
  invoiceGkey: number;
  final: string;
  finalizedDate: string;
  creator: string;
  paid: string;
  customer: string;
  currency: string;
  total: string;
}

export interface InvoiceParams {
  orderBy: string;
  invoiceType: string;
  dateFinalized: string;
}

export interface InvoiceFilters {
  value: string;
}

export interface InvoicesLoadedDetails {
  invoicesLoadedLength: number;
  invoicesLoadedType: string;
  invoicesLoadedTotalAmount: string;
}

export interface UploadInvoicesDTO {
  invoices: string[];
  uploadToProduction: boolean;
  invoiceType: string;
}
