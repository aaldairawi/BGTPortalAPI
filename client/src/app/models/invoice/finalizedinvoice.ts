export interface IFinalizedInvoiceResponse {
  invoiceType: string;
  invoices: IFinalizedInvoiceDto[];
  invoicesLength: number;
}
export interface IFinalizedInvoiceDto {
  id: number;
  invoiceGkey: number;
  draft: number;
  final: string;
  finalizedDate: string;
  customer: string;
  currency: string;
}

export interface IFinalizedInvoiceItemDto {
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
