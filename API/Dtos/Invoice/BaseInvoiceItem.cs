
namespace API.Dtos.Invoice
{
    public class BaseInvoiceItem
    {
        public required string InvoiceFinalNumber { get; set; }
        public required double Rate { get; set; }
        public required string Description { get; set; }
        public required double Quantity { get; set; }
        public required DateTime FinalizedDate { get; set; }
        public required double ItemTotalAmount { get; set; }
        public required string EventTypeId { get; set; }
    }
}