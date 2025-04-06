
using API.Dtos.CtypeInvoice;
using API.Dtos.Invoice;

namespace API.Services
{
    public interface IFinalInvoice
    {
        Task<FinalInvoiceResponseDto> GetFinalizedInvoicesByIdAndDate(string invoiceId, DateTime finalizedDate);
        
        Task<List<FinalizedInvoiceItemsDto>> GetFinalizedInvoiceItemDetails(int invoiceGkey);
        Task<List<InvoiceTypeDto>> LoadAllInvoicesById(string invoiceId);
        
        
    }
}