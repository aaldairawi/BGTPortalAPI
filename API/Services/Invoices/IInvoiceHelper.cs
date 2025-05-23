

using API.Dtos.Invoice;

namespace API.Services.Invoices
{
    public interface IInvoiceHelper
    {
        Task<string> GetCustomerNameBasedOnInvoiceFinalNumber(string invoiceFinalNumber);
        Task<string> GetCustomerSapCode(string customerName);
        Task<Dictionary<string, string>> GetContainerSize(IEnumerable<string> containerIds);
        Task<string> RetrieveBerthAssignedToInvoice(string unitFacilityVisitGkey);
        Task<string> GetUnitFacilityVisitGkey(string invoiceGkey);
        Task<string> GetRefValue(string refId);
        Task<string> GetInvoiceGkeyFromBillingInvoices(string invoiceFinalNumber);
        Task<string> GetInvoiceTotalAmount(string invoiceFinalNumber);
        Task<string> GetInvoiceFinalizedDate(string invoiceFinalNumber);

        Task<List<InvoiceItemDto>> GetInvoiceItems(string invoiceFinalNumber);
        Task<InvoiceCurrencyAndNotesDto> GetInvoiceCurrencyAndNotes(string invoiceFinalNbr);
        Task<List<InvoiceMetaDataDto>> GetInvoiceMetaData(List<string> invoiceFinalNumbers);

    }
}