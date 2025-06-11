
namespace API.Dtos.Invoice
{
    public class SLInvoiceItemDto : BaseInvoiceItem
    {

        public required string Notes { get; set; }
        public required string Name { get; set; }
        public required string TariffId { get; set; }

        public required double RateBilled { get; set; }

    }
}