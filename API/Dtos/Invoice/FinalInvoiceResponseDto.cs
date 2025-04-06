using System.ComponentModel.DataAnnotations;


namespace API.Dtos.Invoice
{
    public class FinalInvoiceResponseDto([Required] string invoiceId, List<FinalInvoiceDto> invoices)
    {
        public string InvoiceId { get; init; } = invoiceId;
        public List<FinalInvoiceDto> Invoices { get; init; } = invoices;
        public int InvoicesLength => Invoices.Count;

    }
}