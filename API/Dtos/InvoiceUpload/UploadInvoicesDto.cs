
namespace API.Dtos.InvoiceUpload
{
    public class UploadInvoicesDto
{
    public List<string> Invoices { get; set; } = [];
    public string InvoiceType { get; set; } = string.Empty;
    public UploadInvoicesDto(List<string> invoices, string invoiceType)
    {
        Invoices = invoices;
        InvoiceType = invoiceType;
    }

}
}