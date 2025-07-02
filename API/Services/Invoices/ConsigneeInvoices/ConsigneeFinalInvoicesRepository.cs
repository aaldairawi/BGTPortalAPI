using API.Dtos.Invoice;
using API.Helper;
using API.Services.Database;
using API.Services.Invoices.InvoiceHelper;


namespace API.Services.Invoices.ConsigneeInvoices
{
    public class ConsigneeFinalInvoicesRepository(IDatabase database, IInvoiceHelper invoiceHelper) : IConsigneeFinalInvoices
    {
        private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));
        private readonly IInvoiceHelper _invoiceHelper = invoiceHelper ?? throw new ArgumentNullException(nameof(invoiceHelper));


        public async Task<List<InvoiceTypeDto>> LoadAllCTypeInvoices()
        {
            var query = GetInvoiceQueries.LoadAllCtypeInvoices();
            var result = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
            {
                List<InvoiceTypeDto> invoiceTypes = [];
                int invoiceTypeIndex = reader.GetOrdinal("InvoiceTypes");

                while (await reader.ReadAsync())
                {
                    var typeGroup = reader.IsDBNull(invoiceTypeIndex) ? "" : reader.GetString(invoiceTypeIndex);
                    invoiceTypes.Add(new InvoiceTypeDto(typeGroup));
                }
                return invoiceTypes;
            });

            return result;
        }

        public async Task<List<InvoiceItemDto>> GetConsigneeInvoiceItems(long invoiceGkey)
        {
            return await _invoiceHelper.GetConsigneeInvoiceItems(invoiceGkey);
        }


    }
}
