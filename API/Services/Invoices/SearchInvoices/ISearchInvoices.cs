
using API.Dtos.Invoice;

namespace API.Services.Invoices.SearchInvoices;

public interface ISearchInvoices
{
    /// <summary>
    ///Retrieves an invoice by the final invoice number.
    /// </summary>
    /// <param name="invoiceFinalId">The final invoice number to search by.</param>
    /// <returns>A <see cref="FinalInvoiceDto"/> if the invoice exists, otherwise null.</returns>
    Task<FinalInvoiceDto?> SearchFinalizedInvoiceById(string invoiceFinalId);

    /// <summary>
    /// Retrieves a List of FinalizedInvoiceDto by the InvoiceId and the Finalized Date.
    /// </summary>
    /// <param name="invoiceId"></param>
    /// <param name="finalizedDate"></param>
    /// <returns> A list of <see cref="FinalInvoiceDto"/> if the data exsits , otherwise null.</returns>
    Task<List<FinalInvoiceDto>> SearchConsigneeInvoicesByQueryParams(string invoiceId, string finalizedDate);

    /// <summary>
    /// Retrieves a list of FinalInvoiceDto based on the date requested. This
    /// method is for shipping line invoices.
    /// </summary>
    /// <param name="date"></param>
    /// <returns>A list of <see cref="FinalInvoiceDto"/> where the finalized date matches the date passed.</returns>
    Task<List<FinalInvoiceDto>> GetShippingLineInvoicesByFinalizedDate(DateTime finalizedDate);



}