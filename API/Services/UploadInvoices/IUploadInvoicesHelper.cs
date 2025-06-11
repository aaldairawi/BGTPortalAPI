
using System.Data;
using API.Dtos.InvoiceUpload;

namespace API.Services.Invoices;

public interface IUploadInvoicesHelper
{
    DataTable CreateInvoiceNumberTempTable(List<string> invoices);
    Task<List<InvoiceBillingMetaDataDto>> GetInvoiceBillingMetaDataWithTempTableAsync(List<string> invoices);
    Task EnrichBillingMetaDto(List<InvoiceBillingMetaDataDto> invoices);
    


}