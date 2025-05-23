import { FinalizedInvoiceDto } from "../models/invoice/invoice.types";

export const calculateInvoicesTotalAmount = (
  invoices: FinalizedInvoiceDto[]
) : string => {
    
  const invoiceTotal = invoices.reduce(
    (previousInvoice, currInvoice) => previousInvoice + parseFloat(currInvoice.total),
    0
  );
  return invoiceTotal.toFixed(2);
};


export const formatInvoiceTotal = (total: number) => {
  const [whole, decimal]  = total.toFixed(2).split("."); 

  const reversedNumber = whole.split('').reverse();
  const result = [];

  for(let i = 0; i < reversedNumber.length; i++)
  {
    if( i > 0 && i % 3 === 0)
    {
      result.push(",");
    }
    result.push(reversedNumber[i]);
  
  }
  const formattedWhole = result.reverse().join('');
  return `${formattedWhole}.${decimal}`;

};
