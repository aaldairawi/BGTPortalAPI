using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;
using API.Helper;

namespace API.Services.CSVBuilder;

public class CsvBuilderServiceRepository : ICsvBuilderService
{

    public string BuildCsvHeader(CsvHeaderLineDto csvHeader)
    {
        var invoiceFinalizedDate = DateHelper.FormatSafeDate(csvHeader.InvoiceFinalizedDate, false);
        const string headerText = "HDR";


        // Convert amount to decimal
        var originalAmount = decimal.TryParse(csvHeader.InvoiceTotalAmount, out var parsedAmount)
            ? parsedAmount
            : 0m;

        // Convert if exchange rate provided
        var convertedAmount = csvHeader.ExchangeRate.HasValue && csvHeader.ExchangeRate > 0
            ? Math.Round(originalAmount / csvHeader.ExchangeRate.Value, 2)
            : originalAmount;

        var hdr = string.Join(
            ",",
            headerText,
            csvHeader.InvoiceFinalNumber,
            invoiceFinalizedDate,
            csvHeader.InvoiceCurrency,
            invoiceFinalizedDate,
            csvHeader.InvoiceNotes,
            csvHeader.CustomerSapCode,
            "",
            convertedAmount.ToString("F2"), "",
            csvHeader.CustomerName.ToUpper(),
            "INVOICE",
            "",
            "",
            "",
            csvHeader.ProfitCenter
        );

        return hdr;
    }



    public string BuildCsvHeaderSL4(CsvHeaderLineSL4Dto csvHeader)
    {
        var invoiceFinalizedDate = DateHelper.FormatSafeDate(csvHeader.InvoiceFinalizedDate, false);
        const string headerText = "HDR";


        // Convert amount to decimal
        var originalAmount = decimal.TryParse(csvHeader.InvoiceTotalAmount,
        out var parsedAmount)
            ? parsedAmount
            : 0m;

        // Convert if exchange rate provided
        var convertedAmount = csvHeader.ExchangeRate.HasValue && csvHeader.ExchangeRate > 0
            ? Math.Round(originalAmount / csvHeader.ExchangeRate.Value, 2)
            : originalAmount;

        var hdr = string.Join(
            ",",
            headerText,
            csvHeader.InvoiceFinalNumber,
            invoiceFinalizedDate,
            csvHeader.InvoiceCurrency,
            invoiceFinalizedDate,
            csvHeader.InvoiceNotes,
            csvHeader.CustomerSapCode,
            "",
            convertedAmount.ToString("F2"),
            "",
            csvHeader.InvoiceNotes,
            "GLPOST",
            "",
            "",
            "",
            csvHeader.ProfitCenter
        );

        return hdr;
    }




    public string BuildCsvLine(InvoiceItemDto invoiceItem, string invoiceFinalNumber, string containerLength,
   decimal? exchangeRate = null)
    {
        var reference = $"{invoiceFinalNumber}-{containerLength}-{invoiceItem.Quantity}";
        const string LIN = "LIN";

        // Fix: Cast double to decimal for division
        var amount = exchangeRate.HasValue && exchangeRate > 0
            ? Math.Round((decimal)invoiceItem.ItemTotalAmount / exchangeRate.Value, 2)
            : (decimal)invoiceItem.ItemTotalAmount;

        var lin = string.Join(",",
            LIN,
            invoiceFinalNumber,
            "",
            invoiceItem.GLCode,
            $"{invoiceItem.ContainerId}-{invoiceItem.EventTypeId}",
            reference,
            "",
            amount.ToString("F2"),
            "",
            "",
            "",
            reference
        );

        return lin;
    }
    public string BuildShippingLineCsvLine(SLInvoiceCsvLineDto item, decimal? exchangeRate = null)
    {
        const string LIN = "LIN";

        // Convert ItemTotalAmount if exchange rate is provided
        var amount = exchangeRate.HasValue && exchangeRate > 0
            ? Math.Round(item.ItemTotalAmount / exchangeRate.Value, 2)
            : item.ItemTotalAmount;

        var line = string.Join(",",
            LIN,
            item.InvoiceFinalNumber,
            "",
            item.GlCode,
            item.TariffId,
            item.Quantity,
            "",
            amount.ToString("F2") // 2 decimal places
        );

        return line;
    }

    public string BuildSl4ShippingLineCsvLine(Sl4InvoiceItemCsvDto item)
    {
        WriteLine("Amount passed in to LIN" + item.TotalInvoiceLineAmount);

        const string LIN = "LIN";

        var line = string.Join(",",
            LIN,
            item.FinalNumber,
            "",
            item.GlCode,
            item.Notes,
            "",
            "",
            item.TotalInvoiceLineAmount.ToString("F2")
        );
        return line;
    }







}
