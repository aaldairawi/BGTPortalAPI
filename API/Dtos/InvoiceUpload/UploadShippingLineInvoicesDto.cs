
namespace API.Dtos.InvoiceUpload;

public class UploadShippingLineInvoicesDto
{
    public required string InvoiceNumber { get; set; }
    public required string InvoiceType { get; set; }
    public required string Berth { get; set; }

    public UploadShippingLineInvoicesDto() { }

    public UploadShippingLineInvoicesDto(string invoiceNumber, string invoiceType, string berth)
    {
        InvoiceNumber = invoiceNumber;
        InvoiceType = invoiceType;
        Berth = berth;
    }
}
