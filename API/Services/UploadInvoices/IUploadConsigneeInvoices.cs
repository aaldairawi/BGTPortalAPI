

using API.Dtos.InvoiceUpload;

namespace API.Services.UploadInvoices
{
    public interface IUploadConsigneeInvoices
{
    Task<bool> UploadToPreviewCSV(UploadInvoicesDto dto);

    Task<bool> GenerateAndUploadCsv(List<string> invoiceIds, string invoiceType,
    string destinationFolder);

    Task<bool> UploadToSapProduction(UploadInvoicesDto dto);


}
}
