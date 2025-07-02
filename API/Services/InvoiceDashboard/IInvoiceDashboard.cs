
using API.Dtos.InvoiceDashboard;

namespace API.Services.InvoiceDashboard
{
    public interface IInvoiceDashboard
    {
        // Method to get all invoices uploaded.
        // The date selected on the front end is the upload date not the finalized date.
        Task<List<InvoiceHeaderDto>> GetAllUploadedInvoices(DateOnly uploadedDate);

        // Method to get all invoices pending.
        // The date selected on the front end is the invoice finalized date. 
        Task<List<InvoicePendingUploadDto>> ReportAllPendingInvoices(
            HashSet<string> invoiceNumbers,
            DateOnly finalizedDate);


        Task<HashSet<string>>  GetAllPendingInvoiceNumbers(DateOnly finalizedDate);
        


        
    }
}