
namespace API.Dtos.InvoiceDashboard;

public class InvoiceHeaderDto
{
    public int Id { get; set; }
    public required string FinalInvoiceNumber { get; set; }
    public DateTime FinalizedDate { get; set; }
    public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
    
    public string UploadedByName { get; set; } = null!;

    public required string Currency { get; set; }
    public required string InvoiceType { get; set; }
    public required string ProfitCenter { get; set; }
    public required double InvoiceTotal { get; set; }


}

