

namespace API.Dtos.InvoiceUpload;


public class InvoiceBillingMetaDataSL4Dto
{
    public required string InvoiceFinalNumber { get; set; }
    public required DateTime InvoiceFinalizedDate { get; set; }
    public required string InvoiceNotes { get; set; }
    
    public required string InvoiceCurrency { get; set; }
    public required string Berth { get; set; }
    public required double TotalAmount { get; set; }

    public string? ProfitCenter { get; set; }

    public string? CustomerSapCode { get; set; }
    public required string CustomerGkey { get; set; }
    public string ProfitCenterText() => Berth?.Trim().ToUpper() == "B27" ? "profit_cent_27" : "profit_cent_20";
    public void TrimFields()
    {

        if (InvoiceNotes is not null)
            InvoiceNotes = InvoiceNotes.Trim();

        if (Berth is not null)
            Berth = Berth.Trim();
    }

}