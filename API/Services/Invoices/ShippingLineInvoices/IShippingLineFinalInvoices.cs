using API.Dtos.Invoice;

namespace API.Services.Invoices.ShippingLineInvoices;

public interface IShippingLineFinalInvoices
{

        Task<List<FinalInvoiceDto>> GetShippingLineInvoicesByFinalizedDate(DateTime invoiceFinalNumber);
        Task<SLParentAndPartnerInvoiceItemsDto?> GetSlInvoicePartnerItems(long invoiceGkey);


}