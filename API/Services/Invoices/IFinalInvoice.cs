

using API.Dtos.Invoice;

namespace API.Services.Invoices
{
    public interface IFinalInvoice
    {
        Task<List<FinalInvoiceDto>> GetFinalizedInvoicesByQueryParams(string invoiceId,  string finalizedDate);
        Task<List<InvoiceItemDto>> GetFinalizedInvoiceItems(string invoiceGkey);
        
        Task<FinalInvoiceDto?> GetOneFinalizedInvoiceById(string invoiceFinalId);
        Task<List<SLInvoiceItemDto>> GetSLTypeInvoiceItems(long invoiceGkey);

        Task<List<InvoiceTypeDto>> LoadAllCTypeInvoices();
        Task<List<InvoiceTypeDto>> LoadAllSTypeInvoices();
        

    }
}