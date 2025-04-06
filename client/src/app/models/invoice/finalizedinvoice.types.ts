export interface FinalizedInvoiceResponseDto {
  invoiceType: string;
  invoices: FinalizedInvoiceDto[];
  invoicesLength: number;
}
export interface FinalizedInvoiceDto {
  id: number;
  invoiceGkey: number;
  draft: number;
  final: string;
  finalizedDate: string;
  customer: string;
  currency: string;
}

export interface FinalizedInvoiceItemDto {
  id: number;
  description: string;
  quantity: number;
  total: number;
  glCode: string;
  invoiceFinalNumber: string;
  invoiceDraftNumber: number;
  customerName: string;
  invoiceCreatedDate: string;
  invoiceFinalizedDate: string;
  containerId: string;
  chargeableUnitEvent: string;
  quantityBilled: string;
}
