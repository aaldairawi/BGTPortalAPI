
using API.Dtos.CtypeInvoice;
using API.Dtos.Invoice;

using API.Helper;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class FinalInvoiceRepository(IDatabase database) : IFinalInvoice
    {

        private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));

        public async Task<FinalInvoiceResponseDto> GetFinalizedInvoicesByIdAndDate(string invoiceId, DateTime finalizedDate)
        {
            string query = InvoiceQueries.GetAllFinalizedInvoicesQuery();
            var result = await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {
                List<FinalInvoiceDto> invoices = [];
                while (await reader.ReadAsync())
                {
                    int invoiceGkey = reader.GetInt32(reader.GetOrdinal("InvoiceGkey"));
                    var draft = reader.GetInt32(reader.GetOrdinal("Draft"));
                    var final = reader["Final"].ToString() ?? "";
                    var invoiceFinalizedDate = DateHelper.FormatSafeDate(reader["FinalizedDate"]);
                    var customer = reader["Customer"].ToString() ?? "";
                    var currency = reader["Currency"].ToString().CurrencyToString();

                    invoices.Add(new(invoiceGkey, draft, final, invoiceFinalizedDate, customer, currency));
                }
                return new FinalInvoiceResponseDto(invoiceId, invoices);
            }, new SqlParameter("@finalizedDate", finalizedDate.ToString("yyyy-MM-dd")), new SqlParameter("@invoiceId", $"{invoiceId}_"));
            return result;
        }

        public async Task<List<FinalizedInvoiceItemsDto>> GetFinalizedInvoiceItemDetails(int invoiceGkey)
        {
            var query = InvoiceQueries.GetCTypeFinalizedInvoiceItemDetails();
            var result = await _database.ExecuteReaderAsync("BillingN4DatabaseConnection", query, async reader =>
            {
                List<FinalizedInvoiceItemsDto> invoiceItemsList = [];
                while (await reader.ReadAsync())
                {
                    var description = reader["Description"].ToString() ?? "";
                    var quantity = Convert.ToInt32(reader["Quantity"].ToString());
                    var total = Convert.ToDouble(reader["Total"].ToString());
                    var glCode = reader["GlCode"].ToString() ?? "";
                    var invoiceFinalNumber = reader["InvoiceFinalNumber"].ToString() ?? "";
                    var customerName = reader["CustomerName"].ToString() ?? "";

                    var invoiceCreatedDate = DateHelper.FormatSafeDate(reader["InvoiceCreatedDate"]);
                    var invoiceFinalizedDate = DateHelper.FormatSafeDate(reader["InvoiceFinalizedDate"]);

                    var containerId = reader["ContainerId"].ToString() ?? "";
                    var chargeableUnitEvent = reader["ChargeableUnitEvent"].ToString() ?? "";
                    var invoiceDraftNumber = reader["InvoiceDraftNumber"].ToString() ?? "";
                    var quantityBilled = Convert.ToDouble(reader["QuantityBilled"].ToString());

                    invoiceItemsList.Add(new FinalizedInvoiceItemsDto(
                        Guid.NewGuid().ToString(),
                        description,
                        quantity,
                        quantityBilled,
                        total,
                        glCode,
                        invoiceFinalNumber,
                        customerName,
                        invoiceCreatedDate,
                        invoiceFinalizedDate,
                        containerId,
                        chargeableUnitEvent,
                        invoiceDraftNumber
                    ));
                }
                return invoiceItemsList;
            }, new SqlParameter("@invoiceGkey", invoiceGkey));
            return result;
        }

        // private async Task<string> GetUnitFacilityVisitGkey(int invoiceGkey)
        // {
        // }

        public async Task<List<InvoiceTypeDto>> LoadAllInvoicesById(string invoiceId)
        {
            var query = InvoiceQueries.GetInvoiceTypeById();
            var result = await _database.ExecuteReaderAsync("BillingN4DatabaseConnection", query, async reader =>
            {
                List<InvoiceTypeDto> invoiceTypes = [];
                while (await reader.ReadAsync())
                {
                    var typeGroup = reader["TypeGroup"].ToString() ?? "";
                    invoiceTypes.Add(new InvoiceTypeDto(typeGroup));
                }
                return invoiceTypes;
            }, new SqlParameter("@invoiceId", invoiceId));

            return result;
        }
    }
}