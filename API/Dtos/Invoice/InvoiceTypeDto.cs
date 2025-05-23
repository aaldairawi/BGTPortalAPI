
namespace API.Dtos.Invoice
{
    public class InvoiceTypeDto{
        public string Value { get; set; } = string.Empty;
        public InvoiceTypeDto(string value)
        {
            Value = value;
        }
    }
}
