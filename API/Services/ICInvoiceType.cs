using API.Dtos.CtypeInvoice;

namespace API.Services
{
    public interface ICInvoiceType
    {
        Task<List<CTypeDto>> GetAllCInvoiceTypes();

    }
}