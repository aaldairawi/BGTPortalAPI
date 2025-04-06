

namespace API.Services
{
    public interface IInvoiceHelper 
    {
        Task<string> GetCustomerSapCode(string customerName);
        Task<string> GetContainerSize(string containerId);
        Task<string> RetrieveBerthAssignedToInvoice(int unitFacilityVisitGkey);
        Task<string> GetUnitFacilityVisitGkey(int invoiceGkey);
    
    }
}