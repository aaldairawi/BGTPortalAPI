
namespace API.Dtos.InvoiceUpload;

public class Sl4InvoiceItemCsvDto
{
    public required string FinalNumber { get; set; }
    public required string GlCode { get; set; }
    public required string Notes { get; set; }
    public double TotalInvoiceLineAmount { get; set; }

}