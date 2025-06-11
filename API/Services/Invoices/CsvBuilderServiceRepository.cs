using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;
using API.Helper;

namespace API.Services.Invoices
{
    public class CsvBuilderServiceRepository : ICsvBuilderService
    {

        public string BuildCsvHeader(CsvHeaderLineDto csvHeader)
        {
            var invoiceFinalizedDate = DateHelper.FormatSafeDate(csvHeader.InvoiceFinalizedDate, false);
            const string headerText = "HDR";
            const string invoiceText = "INVOICE";

            var invoiceTotalAmount = csvHeader.InvoiceTotalAmount;
            var hdr = string.Join(",",
                headerText,
                csvHeader.InvoiceFinalNumber,
                invoiceFinalizedDate,
                csvHeader.InvoiceCurrency,
                invoiceFinalizedDate,
                csvHeader.InvoiceNotes,
                csvHeader.CustomerName,
                "",
                invoiceTotalAmount,
                "",
                invoiceTotalAmount,
                invoiceText,
                "",
                "",
                "",
                csvHeader.ProfitCenter);
            return hdr;
        }

        public string BuildCsvLine(InvoiceItemDto invoiceItem, string invoiceFinalNumber, string containerLength)
        {
            var reference = $"{invoiceFinalNumber}-{containerLength}-{invoiceItem.Quantity}";
            const string LIN = "LIN";
            var lin = string.Join(",",
                    LIN,
                    invoiceFinalNumber,
                    "",
                    invoiceItem.GLCode,
                    $"{invoiceItem.ContainerId}-{invoiceItem.EventTypeId}",
                    reference,
                    "",
                    invoiceItem.ItemTotalAmount,
                    "",
                    "",
                    "",
                    reference);
            return lin;
        }



    }
}