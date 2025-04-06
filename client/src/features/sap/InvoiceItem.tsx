import { FinalizedInvoiceItemDto } from "../../app/models/invoice/finalizedinvoice.types";
import React from "react";
import TableRowComponent from "../../app/components/TableRowComponent";

interface Props {
  invoiceItem: FinalizedInvoiceItemDto;
  index: number;
}

const InvoiceItem: React.FC<Props> = (props: Props) => {
  const { invoiceItem, index } = props;

  const indexOfInvoiceItem = index + 1;
  return (
    <TableRowComponent
      tableRowCellHeadings={[
        indexOfInvoiceItem.toString(),
        invoiceItem.description,
        invoiceItem.quantity.toString(),
        invoiceItem.quantityBilled,
        invoiceItem.total.toString(),
        invoiceItem.glCode,
        invoiceItem.customerName,
        invoiceItem.containerId,
        invoiceItem.chargeableUnitEvent,
      ]}
    />
  );
};

export default InvoiceItem;
