
using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;

namespace API.Services.Invoices
{
    public interface ICsvBuilderService
    {
        string BuildCsvHeader(CsvHeaderLineDto dto);
        string BuildCsvLine(InvoiceItemDto item, string invoiceFinal, string containerLength);
        
    }
}