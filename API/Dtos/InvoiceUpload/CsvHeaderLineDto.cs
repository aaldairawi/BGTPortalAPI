
namespace API.Dtos.InvoiceUpload;
public class CsvHeaderLineDto(
    string invoiceFinalNumber,
    DateTime invoiceFinalizedDate,
    string customerSapCode,
    string invoiceTotalAmount,
    string customerName,
    string profitCenter,
    string currency,
    string notes,
    decimal? exchangeRate = null
    )
{
    public string InvoiceFinalNumber { get; init; } = invoiceFinalNumber;
    public DateTime InvoiceFinalizedDate { get; init; } = invoiceFinalizedDate;
    public string CustomerSapCode { get; init; } = customerSapCode;
    public string InvoiceTotalAmount { get; init; } = invoiceTotalAmount;
    public string CustomerName { get; init; } = customerName;
    public string ProfitCenter { get; init; } = profitCenter;
    public string InvoiceCurrency { get; set; } = currency;
    public string InvoiceNotes { get; set; } = notes;

    public decimal? ExchangeRate { get; set; } = exchangeRate;
}
