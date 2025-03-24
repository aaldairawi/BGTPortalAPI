namespace API.Dtos.CtypeInvoice
{
    public class CTypeFinalInvoiceResponse
    {
        public string InvoiceType { get; set; } = string.Empty;
        public List<CTypeFinalInvoiceDto> Invoices { get; set; } = [];
        public int InvoicesLength { get; set; }
    }
}