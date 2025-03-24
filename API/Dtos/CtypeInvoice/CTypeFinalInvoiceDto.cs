namespace API.Dtos.CtypeInvoice
{
    public class CTypeFinalInvoiceDto
    {
        public long InvoiceGkey { get; set; }
        public long Id { get; set; }
        public long Draft { get; set; }
        public string Final { get; set; } = string.Empty;
        public string FinalizedDate { get; set; }
        public string Customer { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;

        public CTypeFinalInvoiceDto(long invoiceGkey, long draft, string final, string finalizedDate, string customer, string currency)
        {
            InvoiceGkey = invoiceGkey; Id = draft; Draft = draft; Final = final; FinalizedDate = finalizedDate; Customer = customer; Currency = currency;
        }
    }
}