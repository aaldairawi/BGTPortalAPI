import { FinalizedInvoiceDto } from "../models/invoice/invoice.types";

export const formatInvoiceTotal = (value: number): string =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const calculateInvoicesTotalAmount = (
  items: FinalizedInvoiceDto[]
): string => {
  const total = items.reduce(
    (prevValue, currentValue) => prevValue + currentValue.total,
    0
  );
  
  return formatInvoiceTotal(total);
};
