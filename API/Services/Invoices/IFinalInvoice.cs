

using API.Dtos.Invoice;

namespace API.Services.Invoices
{
    public interface IFinalInvoice
    {
        Task<FinalInvoicesResponseDto> GetFinalizedInvoicesByQueryParams(string invoiceId, string orderBy, string finalizedDate);
        
        Task<FinalInvoicesResponseDto> GetOneFinalizedInvoiceById(string invoiceFinalId);        
        
        Task<string> GetInvoiceType(string invoiceFinalId);

        Task<List<InvoiceTypeDto>> LoadAllInvoiceTypes();
    }
}