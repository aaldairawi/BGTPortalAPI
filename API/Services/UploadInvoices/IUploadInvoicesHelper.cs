
using System.Data;
using API.Dtos.InvoiceUpload;

namespace API.Services.UploadInvoices;

public interface IUploadInvoicesHelper
{
    DataTable CreateInvoiceNumberTempTable(List<string> invoices);
    Task<List<InvoiceBillingMetaDataDto>> GetInvoiceBillingMetaDataWithTempTableAsync(List<string> invoices);

    Task<InvoiceBillingMetaDataDto?> GetShippingLineInvoiceBillingMetaDataDto(string invoiceFinalNumber, string berth);
    Task EnrichBillingMetaDto(List<InvoiceBillingMetaDataDto> invoices);

    Task<InvoiceBillingMetaDataSL4Dto?> GetShippingLineInvoiceSL4BillingMetaDataDto(string invoiceFinalNumber,
    string berth);

    Task EnrichShippingLineBillingMetaDto(InvoiceBillingMetaDataDto dto);

    Task EnrichShippingLineSL4BillingMetaDto(InvoiceBillingMetaDataSL4Dto dto);

    Task<decimal?> GetIQDtoUSDRateAsync();



}