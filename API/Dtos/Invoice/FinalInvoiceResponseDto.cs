
namespace API.Dtos.Invoice
{
    public class FinalInvoicesResponseDto
    {
        public string InvoiceId { get; init; } = string.Empty;
        public List<FinalInvoiceDto> Invoices { get; init; } = [];
        public int InvoicesLength => Invoices.Count;

        public FinalInvoicesResponseDto(string invoiceId, List<FinalInvoiceDto>  invoices)
        {
            InvoiceId = invoiceId; Invoices = invoices;

        }
    }
}