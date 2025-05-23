using API.Dtos.Invoice;

namespace API.Services.Invoices
{
    public interface IUploadInvoices
    {
        /// <summary>
        /// Determines which folder (test or production) to upload invoices based on the UploadToProduction flag.
        /// </summary>
        Task<bool> UploadInvoices(UploadInvoicesDto dto);

        /// <summary>
        /// Uploads invoices to the test SAP FTP folder.
        /// </summary>
        Task<bool> UploadInvoicesSapTestFolder(UploadInvoicesDto dto);

        /// <summary>
        /// Uploads invoices to the production SAP FTP folder.
        /// </summary>
        Task<bool> UploadInvoicesSapProductionFolder(UploadInvoicesDto dto);
    }
}
