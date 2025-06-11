using System.ComponentModel.DataAnnotations;


namespace API.Dtos.Invoice
{
    public class FinalInvoiceDto
    {
        public long InvoiceGkey { get; init; }
        public string Id { get; init; } = string.Empty;
        public string Final { get; init; } = string.Empty;
        public string Status { get; init; } = string.Empty;
        public string FinalizedDate { get; init; } = string.Empty;

        public string Creator { get; init; } = string.Empty;
        public string Changer { get; init; } = string.Empty;


        public bool Paid { get; init; }

        public string? Notes { get; init; }
        public string Customer { get; init; } = string.Empty;
        public string Currency { get; init; } = string.Empty;
        public string Total { get; init; }
        public string InvoiceType { get; init; }

        public FinalInvoiceDto(long invoiceGkey, string final, string status, string finalizedDate, string creator,
        string changer, bool paid, string?  notes, string customer, string currency, string total, string invoiceType)
        {
            InvoiceGkey = invoiceGkey;
            Id = final;
            Final = final;
            FinalizedDate = finalizedDate;
            Status = status;
            Creator = creator;
            Changer = changer;
            Paid = paid;
            Notes = notes;
            Customer = customer; Currency = currency;
            Total = total;
            InvoiceType = invoiceType;

        }

    }
}
