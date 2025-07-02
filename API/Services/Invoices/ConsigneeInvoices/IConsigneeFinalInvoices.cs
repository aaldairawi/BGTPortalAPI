

using API.Dtos.Invoice;


namespace API.Services.Invoices.ConsigneeInvoices
{
    public interface IConsigneeFinalInvoices
    {
        /// <summary>
        /// Retrieves the invoice items associated with the invoice gkey passed in.
        /// </summary>
        /// <param name="invoiceGkey">invoice gkey</param>
        /// <returns>A list of <see cref="InvoiceItemDto"/> based on the invoice gkey passed in.</returns>
        Task<List<InvoiceItemDto>> GetConsigneeInvoiceItems(long invoiceGkey);
        /// <summary>
        /// Retrieves a list of all c type invoices in N4 billing.
        /// </summary>
        /// <returns>A list of <see cref="InvoiceTypeDto"/>having the invoice types in N4 billing.</returns>
        Task<List<InvoiceTypeDto>> LoadAllCTypeInvoices();


    }
}