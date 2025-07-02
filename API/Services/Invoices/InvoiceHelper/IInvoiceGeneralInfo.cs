
namespace API.Services.Invoices.InvoiceHelper;

public interface IInvoiceGeneralInfo
{

    /// <summary>
    /// Retrieves the gkey in N4 billing for the invoice.
    /// </summary>
    /// <param name="invoiceFinalNumber"></param>
    /// <returns>The gkey for the invoice as a long data type.</returns>
    Task<long> GetInvoiceGkeyFromBillingInvoices(string invoiceFinalNumber);

    /// <summary>
    /// Retrieves the total amount of an invoice from N4 billing based on the invoice final number.
    /// </summary>
    /// <param name="invoiceFinalNumber"></param>
    /// <returns>A decimal data type for the total invoice amount.</returns>
    Task<decimal> GetInvoiceTotalAmount(string invoiceFinalNumber);

    /// <summary>
    /// Retrieves the invoice finalized date.
    /// </summary>
    /// <param name="invoiceFinalNumber"></param>
    /// <returns>A DateTime representing the finalzed date of the invoice.</returns>
    Task<DateTime> GetInvoiceFinalizedDate(string invoiceFinalNumber);

}