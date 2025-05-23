
namespace API.Dtos.Invoice
{
    public class UploadInvoicesDto
    {
        public List<string> Invoices { get; set; } = [];
        public string InvoiceType { get; set; } = string.Empty;

        public bool UploadToProduction { get; set; } = false;

        public UploadInvoicesDto(List<string> invoices, string invoiceType, bool uploadToProduction)
        {
            Invoices = invoices;
            InvoiceType = invoiceType;
            UploadToProduction = uploadToProduction;
        }

    }
}