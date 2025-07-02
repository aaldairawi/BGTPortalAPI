

using API.Dtos.InvoiceUpload;

namespace API.Services.UploadInvoices;

public interface IUploadSL4Invoices
{
    Task<bool> UploadSL4ToPreviewCSV(UploadSl4InvoiceDto dto);
    Task<bool> UploadSL4ToProduction(UploadSl4InvoiceDto dto);

}