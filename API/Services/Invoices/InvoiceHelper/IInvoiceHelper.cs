

using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;

namespace API.Services.Invoices.InvoiceHelper
{
    public interface IInvoiceHelper
    {
        Task<string> GetCustomerNameBasedOnInvoiceFinalNumber(string invoiceFinalNumber);

        Task<string> GetCustomerSapCode(string customerName);
        Task<Dictionary<string, string>> GetContainerSize(IEnumerable<string> containerIds);
        Task<string> RetrieveBerthAssignedToInvoice(string unitFacilityVisitGkey);
        Task<string> GetUnitFacilityVisitGkey(string invoiceGkey);

        Task<List<InvoiceItemDto>> GetConsigneeInvoiceItems(long invoiceGkey);
        Task<List<SLInvoiceCsvLineDto>> GetSLInvoiceItemsByFinalNumber(string invoiceFinalNumber);

        Task<List<Sl4InvoiceItemCsvDto?>> GetSL4InvoiceLineItemsCsv(
            string parentInvoiceNumber,string partnerInvoiceNumber);


    }
}