export interface FinalizedInvoiceDto {
  invoiceGkey: number;
  id: string;
  final: string;
  status: string;
  finalizedDate: string;
  creator: string;
  changer: string;
  paid: boolean;
  notes: string;
  customer: string;
  currency: string;
  total: number;
  invoiceType: string;
}

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
export interface ConsigneeInvoiceItemDto extends BaseInvoiceItemDto {
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
export type InvoiceItemUnion = ConsigneeInvoiceItemDto | SLInvoiceItemDto;

export interface InvoicesLoadedDetails {
  invoicesLoadedLength: number;
  invoicesLoadedType?: string;
  invoicesLoadedTotalAmount: string;
}

export interface SLParentAndPartnerInvoiceItemsDto {
  parentInvoiceItems: SLInvoiceItemDto[];
  partnerInvoiceItems: SLInvoiceItemDto[];
}

export interface UploadInvoicesDTO {
  invoices: string[];
  invoiceType: string;
}


export interface UploadShippingLineInvoicesDTO {
  invoiceNumber: string;
  invoiceType: string;
  berth: string;
}
export interface UploadSl4InvoiceDto {
  parentInvoiceNumber: string;
  partnerInvoiceNumber: string;
  invoiceType: string;
  berth: string;

}
