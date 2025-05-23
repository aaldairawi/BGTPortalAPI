
namespace API.Dtos.InvoiceUpload
{
    public class CsvHeaderLineDto
    {
        public string InvoiceFinalNumber { get; init; }
        public DateTime InvoiceFinalizedDate { get; init; }
        public string CustomerSapCode { get; init; }
        public string InvoiceTotalAmount { get; init; }
        public string CustomerName { get; init; }
        public string ProfitCenter { get; init; }
        public string InvoiceCurrency {get; set;}
        public string InvoiceNotes {get; set;}    


        public CsvHeaderLineDto(string invoiceFinalNumber, DateTime invoiceFinalizedDate, string customerSapCode,
        string invoiceTotalAmount, string customerName, string profitCenter, string currency, string notes)
        {
            InvoiceFinalNumber = invoiceFinalNumber;
            InvoiceFinalizedDate = invoiceFinalizedDate;
            CustomerSapCode = customerSapCode;
            InvoiceTotalAmount = invoiceTotalAmount;
            CustomerName = customerName;
            ProfitCenter = profitCenter;
            InvoiceCurrency = currency;
            InvoiceNotes = notes;
        

        }
    }
}



