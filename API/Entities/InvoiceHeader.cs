
namespace API.Entities;

public class InvoiceHeader
{
    public int Id { get; set; }
    public required string FinalInvoiceNumber { get; set; }
    public DateTime FinalizedDate { get; set; }
    public bool UploadedSuccessfully { get; set; }
    public DateTime UploadedDate { get; set; } = DateTime.UtcNow;

    public required int UploadedById { get; set; }
    public User UploadedBy { get; set; } = null!;

    public required string Currency { get; set; }
    public required string InvoiceType { get; set; }
    public required string ProfitCenter { get; set; }
    public required double InvoiceTotal { get; set; }


}

