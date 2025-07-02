


namespace API.Dtos.Invoice
{
    public class FinalInvoiceDto(long invoiceGkey, string final, string status, DateTime finalizedDate, string creator,
    string changer, bool paid, string? notes, string customer, string currency, double total, string invoiceType)
    {
        public long InvoiceGkey { get; init; } = invoiceGkey;
        public string Id { get; init; } = final;
        public string Final { get; init; } = final;
        public string Status { get; init; } = status;
        public DateTime FinalizedDate { get; init; } = finalizedDate;

        public string Creator { get; init; } = creator;
        public string Changer { get; init; } = changer;


        public bool Paid { get; init; } = paid;

        public string? Notes { get; init; } = notes;
        public string Customer { get; init; } = customer; public string Currency { get; init; } = currency;
        public double Total { get; init; } = total;
        public string InvoiceType { get; init; } = invoiceType;
    }
}
