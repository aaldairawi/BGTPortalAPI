namespace API.Dtos.Invoice
{
    public class InvoiceItemDto
    {
        public required string InvoiceItemGkey { get; set; }
        public required string InvoiceFinalNumber { get; set; }
        public required string ContainerId { get; set; }
        public required string EventTypeId { get; set; }
        public required string GLCode { get; set; }
        public required string ItemTotalAmount { get; set; }
        public required string Description { get; set; }

        public required int Quantity { get; set; }
        public required int QuantityBilled { get; set; }
        public required string FinalizedDate { get; set; }
    }
}
