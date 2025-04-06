using System.ComponentModel.DataAnnotations;

namespace API.Dtos.Invoice
{
    public class InvoiceTypeDto(
        [StringLength(10, ErrorMessage = "InvoiceId cannot be longer than 200 characters.")]
        [Required]
        string invoiceId
    )
    {
        public string InvoiceId { get; set; } = invoiceId;
    }
}
