using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;

namespace API.Services.CSVBuilder;

public interface ICsvBuilderService
{
    string BuildCsvHeader(CsvHeaderLineDto dto);
    string BuildCsvHeaderSL4(CsvHeaderLineSL4Dto dto);


    string BuildCsvLine(
        InvoiceItemDto item,
        string invoiceFinal,
        string containerLength,
        decimal? exchangeRate = null
    );

    string BuildShippingLineCsvLine(SLInvoiceCsvLineDto item, decimal? exchangeRate);
    string BuildSl4ShippingLineCsvLine(Sl4InvoiceItemCsvDto item);
    
}
