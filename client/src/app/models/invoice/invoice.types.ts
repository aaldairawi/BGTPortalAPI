export interface FinalizedInvoiceDto {
  id: number;
  invoiceType: "C" | "S";
  invoiceGkey: number;
  final: string;
  finalizedDate: string;
  status: string;
  creator: string;
  changer: string;
  paid: boolean;
  notes: string;
  customer: string;
  currency: string;
  total: string;
}

export type GetInvoiceItemsParams = {
  invoiceGkey: string;
  invoiceType: "C" | "S";
};
export interface InvoiceParams {
  invoiceType: string;
  dateFinalized: string;
}

export interface InvoiceFilters {
  value: string;
}

interface BaseInvoiceItemDto {
  invoiceFinalNumber: string;
  finalizedDate: string;
  description: string;
  quantity: number;
  rate: number;
  itemTotalAmount: number;
}

// C Type extends base.
export interface InvoiceItemDto extends BaseInvoiceItemDto {
  invoiceItemGkey: string;
  containerId: string;
  eventTypeId: string;
  glCode: string;
  quantityBilled: number;
}

// S Type extends base.
export interface SLInvoiceItemDto extends BaseInvoiceItemDto {
  notes: string;
  name: string;
  tariffId: string;
  rateBilled: number;
}

// Discriminated Union.
export type InvoiceItemUnion = InvoiceItemDto | SLInvoiceItemDto;

export interface InvoicesLoadedDetails {
  invoicesLoadedLength: number;
  invoicesLoadedType?: string;
  invoicesLoadedTotalAmount: string;
}

export interface UploadInvoicesDTO {
  invoices: string[];
  invoiceType: string;
}
