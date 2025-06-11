namespace API.Dtos.Invoice
{
    public class InvoiceItemDto : BaseInvoiceItem
    {
        public required string InvoiceItemGkey { get; set; }

        public required string ContainerId { get; set; }

        public required string GLCode { get; set; }
        public required double QuantityBilled { get; set; }

        
    }
}
