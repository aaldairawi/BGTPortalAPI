using System.ComponentModel.DataAnnotations;
using API.Enums;

namespace API.Dtos.Invoice
{
    public class FinalInvoiceDto(
        int invoiceGkey,
        int draft,
        [StringLength(6, ErrorMessage = "Final must be 6 characters long.")]
        [Required]
        string final,
        
        [StringLength(50, ErrorMessage = "FinalizedDate must be 50 characters long.")]
        [Required]
        string finalizedDate,

        [StringLength(100, ErrorMessage = "Customer must be 100 characters long.")]
        [Required]
        string customer,

        [StringLength(3, ErrorMessage = "Currency must be 3 characters long.")]
        [Required]
        Currency currency
    )
    {
        public int InvoiceGkey { get; set; } = invoiceGkey;
        public int Id { get; set; } = draft;
        public int Draft { get; set; } = draft;
        public string Final { get; set; } = final;
        public string FinalizedDate { get; set; } = finalizedDate;
        public string Customer { get; set; } = customer;
        public Currency Currency { get; set; } = currency;
    }
}
