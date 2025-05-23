using API.Dtos.CtypeInvoice;
using API.Dtos.Invoice;
using API.Helper;
using Microsoft.Data.SqlClient;

namespace API.Services.Invoices
{
    public class FinalInvoiceRepository(IDatabase database) : IFinalInvoice
    {
        private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));
        public async Task<FinalInvoicesResponseDto> GetFinalizedInvoicesByQueryParams(string invoiceId,
        string orderBy, string finalizedDate)
        {
            var allowedOrderColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "Final", "Customer",
            };

            if (!allowedOrderColumns.Contains(orderBy))
                throw new ArgumentException("Invalid order by column");

            string query = InvoiceQueries.GetFinalizedInvoicesByQueryParams(orderBy);

            var result = await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {
                List<FinalInvoiceDto> invoices = [];
                while (await reader.ReadAsync())
                {
                    var invoiceGkey = reader.GetInt64(reader.GetOrdinal("InvoiceGkey"));

                    var final = reader["Final"].ToString() ?? "";

                    var invoiceFinalizedDate = DateHelper.FormatSafeDate(reader["FinalizedDate"], true);
                    var creator = reader["Creator"].ToString() ?? "";
                    var paid = reader["Paid"].ToString() ?? "";

                    var customer = reader["Customer"].ToString() ?? "";
                    var currency = reader["Currency"].ToString() ?? "";
                    var total = reader.GetDouble(reader.GetOrdinal("Total")).ToString() ?? "";

                    invoices.Add(new(invoiceGkey, final, invoiceFinalizedDate, creator, paid, customer, currency
                    , total));
                }
                return invoices;
            }, new SqlParameter("@invoiceId", invoiceId), new SqlParameter("@finalizedDate", finalizedDate));

            FinalInvoicesResponseDto responseResult = new(invoiceId, result);
            return responseResult;
        }

        public async Task<List<FinalizedInvoiceItemsDto>> GetFinalizedInvoiceItemDetails(int invoiceGkey)
        {
            var query = InvoiceQueries.GetCTypeFinalizedInvoiceItemDetails();
            var result = await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {
                List<FinalizedInvoiceItemsDto> invoiceItemsList = [];
                while (await reader.ReadAsync())
                {
                    var description = reader["Description"].ToString() ?? "";
                    var quantity = Convert.ToInt32(reader["Quantity"].ToString());

                    var total = reader["Total"] != DBNull.Value ? Convert.ToDouble(reader["Total"]).ToString("F2") : "0.00";

                    var glCode = reader["GlCode"].ToString() ?? "";
                    var invoiceFinalNumber = reader["InvoiceFinalNumber"].ToString() ?? "";
                    var customerName = reader["CustomerName"].ToString() ?? "";

                    var invoiceCreatedDate = DateHelper.FormatSafeDate(reader["InvoiceCreatedDate"], true);
                    var invoiceFinalizedDate = DateHelper.FormatSafeDate(reader["InvoiceFinalizedDate"], true);

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

        public async Task<List<InvoiceTypeDto>> LoadAllInvoiceTypes()
        {
            var query = InvoiceQueries.LoadAllInvoiceTypes();
            var result = await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {
                List<InvoiceTypeDto> invoiceTypes = [];
                while (await reader.ReadAsync())
                {
                    var typeGroup = reader["InvoiceTypes"].ToString() ?? "";
                    invoiceTypes.Add(new InvoiceTypeDto(typeGroup));
                }
                return invoiceTypes;
            });

            return result;
        }

        public async Task<FinalInvoicesResponseDto> GetOneFinalizedInvoiceById(string invoiceFinalNumber)
        {
            var query = InvoiceQueries.GetOneFinalizedInvoiceById();
            var result = await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {
                List<FinalInvoiceDto> invoices = [];
                while (await reader.ReadAsync())
                {
                    var invoiceGkey = reader.GetInt64(reader.GetOrdinal("InvoiceGkey"));

                    var final = reader["Final"].ToString() ?? "";

                    var invoiceFinalizedDate = DateHelper.FormatSafeDate(reader["FinalizedDate"], true);
                    var creator = reader["Creator"].ToString() ?? "";
                    var paid = reader["Paid"].ToString() ?? "";
                    var customer = reader["Customer"].ToString() ?? "";
                    var currency = reader["Currency"].ToString() ?? "";
                    var total = reader.GetDouble(reader.GetOrdinal("Total")).ToString() ?? "";
                    invoices.Add(new(invoiceGkey, final, invoiceFinalizedDate, creator, paid, customer, currency, total));
                }
                return invoices;
            }, new SqlParameter("@invoiceFinalId", invoiceFinalNumber));
            var invoiceType = await GetInvoiceType(invoiceFinalNumber);

            FinalInvoicesResponseDto functionResult = new(invoiceType, result);
            return functionResult;
        }

        public async Task<string> GetInvoiceType(string invoiceFinalNumber)
        {
            var query = InvoiceQueries.GetInvoiceTypeByInvoiceFinalNumber();
            var result = await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {
                while (await reader.ReadAsync())
                {
                    return reader["InvoiceType"].ToString() ?? "";
                }
                return string.Empty;
            }, new SqlParameter("@invoiceFinalNumber", invoiceFinalNumber));
            return result;
        }

    }

}