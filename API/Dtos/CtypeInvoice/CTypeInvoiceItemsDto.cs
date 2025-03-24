namespace API.Dtos.CtypeInvoice
{
    public class CTypeInvoiceItemsDto
    {
        public string Id { get; set; } = string.Empty;
        public string Description { get; set; }
        public int  Quantity { get; set; }
        public double Total { get; set; }
        public string GlCode { get; set; }

        public string InvoiceFinalNumber { get; set; }
        public string CustomerName { get; set; } = null!;
        public string InvoiceCreatedDate { get; set; }

        public string InvoiceFinalizedDate { get; set; }
       public double QuantityBilled { get; set; }


        public string ContainerId { get; set; }

        public string InvoiceDraftNumber { get; set; }

        public string ChargeableUnitEvent { get; set; }
        public CTypeInvoiceItemsDto(string id, string description, int quantity, double quantityBilled, double total, string glCode, string invoiceFinalNumber,
         string customerName,
        string invoiceCreatedDate, string invoiceFinalizedDate, string containerId, string chargeableUnitEvent, string invoiceDraftNumber)
        {
            Id = id; Description = description; Quantity = quantity; QuantityBilled = quantityBilled; Total = total; GlCode = glCode;
            InvoiceFinalNumber = invoiceFinalNumber; CustomerName = customerName; InvoiceCreatedDate = invoiceCreatedDate;
            InvoiceFinalizedDate = invoiceFinalizedDate; ContainerId = containerId; ChargeableUnitEvent = chargeableUnitEvent;
            InvoiceDraftNumber = invoiceDraftNumber;
        }


 
        // public long InvoiceGkey { get; set; }



        // public string Notes { get; set; } // No need to send back with DTO.

        // public long CustomerGkey { get; set; }




    }
}