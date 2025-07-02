using API.Dtos.InvoiceUpload;

namespace API.Services.UploadInvoices
{
    public interface IUploadSL2Invoices
    {
        Task<bool> UploadSL2ToPreviewCSV(UploadShippingLineInvoicesDto dto);

        Task<bool> UploadSL2ToProduction(UploadShippingLineInvoicesDto dto);
        Task<bool> GenerateAndUploadSlInvoiceCsv(
             string invoiceFinalNumber,
            string invoiceType,
            string berth,
            string destinationFolder);


    }
}
