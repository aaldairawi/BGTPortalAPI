using System.ComponentModel.DataAnnotations;


namespace API.Dtos.Invoice
{
    public class FinalInvoiceDto
    {
        public long InvoiceGkey { get; init; }
        public string Id { get; init; } = string.Empty;

        
        [StringLength(6, ErrorMessage = "Final must be 6 characters long.")]
        [Required]

        public string Final { get; init; } = string.Empty;

        [StringLength(50, ErrorMessage = "FinalizedDate must be no more than 50 characters long.")]
        [Required]

        public string FinalizedDate { get; init; } = string.Empty;

        [StringLength(50, ErrorMessage = "Creator must be no more than 50 characters long.")]
        [Required]
        public string Creator { get; init; } = string.Empty;

        [StringLength(50, ErrorMessage = "Paid must be no more than 50 characters long.")]
        [Required]
        public string Paid { get; init; } = string.Empty;

        [StringLength(100, ErrorMessage = "Customer must be 100 characters long.")]
        [Required]

        public string Customer { get; init; } = string.Empty;
        [StringLength(3, ErrorMessage = "Currency must be 3 characters long.")]
        [Required]

        public string Currency { get; init; } = string.Empty;
        public string Total { get; set; }

        public FinalInvoiceDto(long invoiceGkey,  string final, string finalizedDate, string creator,
        string paid, string customer, string currency, string total)
        {
            InvoiceGkey = invoiceGkey;
            Id = final.ToString();
            Final = final; FinalizedDate = finalizedDate;
            Creator = creator;
            Paid = paid;
            Customer = customer; Currency = currency;
            Total = total;
        }

    }
}
