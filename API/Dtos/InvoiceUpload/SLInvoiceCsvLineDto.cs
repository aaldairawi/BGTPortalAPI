
namespace API.Dtos.InvoiceUpload;

public class SLInvoiceCsvLineDto
{
    
    public string InvoiceFinalNumber { get; set; } = string.Empty;
    public string GlCode { get; set; } = string.Empty;
    public string TariffId { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal ItemTotalAmount { get; set; }
}
