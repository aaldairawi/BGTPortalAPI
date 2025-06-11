
using API.Dtos.Invoice;

namespace API.Services.Invoices
{
    public interface IUploadInvoices
    {
        Task<bool> UploadToPreviewCSV(UploadInvoicesDto dto);

        Task<bool> GenerateAndUploadCsv(List<string> invoiceIds, string invoiceType,
        string destinationFolder);
        
        Task<bool> UploadToSapProduction(UploadInvoicesDto dto);


    }
}
