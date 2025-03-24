using API.Dtos.CtypeInvoice;

namespace API.Services
{
    public interface ICFinalInvoices
    {
        Task<CTypeFinalInvoiceResponse> GetAllCTypeFinalizedInvoices(string invoiceType, DateTime finalizeddate);
        Task<List<CTypeInvoiceItemsDto>> GetCTypeFinalizedInvoiceItemDetails(long invoiceGkey);
        Task<List<CTypeCSVPreviewDto>> GetCTypeCSVPreviewForInvoices(List<CTypeFinalInvoiceDto> cTypeFinalInvoiceDto);

    }
}