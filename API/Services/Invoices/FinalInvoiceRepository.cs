using System.Data;
using System.Globalization;

using API.Dtos.Invoice;
using API.Helper;
using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic;

namespace API.Services.Invoices
{
    public class FinalInvoiceRepository(IDatabase database, IInvoiceHelper invoiceHelper) : IFinalInvoice
    {
        private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));
        private readonly IInvoiceHelper _invoiceHelper = invoiceHelper ?? throw new ArgumentNullException(nameof(invoiceHelper));

public async Task<List<FinalInvoiceDto>> GetFinalizedInvoicesByQueryParams(
    string invoiceId, string finalizedDate)
{
    string query = GetInvoiceQueries.GetFinalizedInvoicesByQueryParams();
    
    var result = await _database.ExecuteReaderAsync(
        DatabaseConnectionConstants.BillingN4Db,
        query,
        async reader =>
        {
            var invoices = new List<FinalInvoiceDto>();

            // Get ordinals once
            int invoiceGkeyOrdinal = reader.GetOrdinal("InvoiceGkey");
            int finalOrdinal = reader.GetOrdinal("Final");
            int statusOrdinal = reader.GetOrdinal("Status");
            int finalizedDateOrdinal = reader.GetOrdinal("FinalizedDate");
            int creatorOrdinal = reader.GetOrdinal("Creator");
            int changerOrdinal = reader.GetOrdinal("Changer");
            int paidOrdinal = reader.GetOrdinal("Paid");
            int notesOrdinal = reader.GetOrdinal("Notes");
            int customerOrdinal = reader.GetOrdinal("Customer");
            int currencyOrdinal = reader.GetOrdinal("Currency");
            int totalOrdinal = reader.GetOrdinal("Total");
            int invoiceTypeOrdinal = reader.GetOrdinal("InvoiceType"); // <-- NEW

            while (await reader.ReadAsync())
            {
                var invoiceGkey = reader.GetInt64(invoiceGkeyOrdinal);
                var final = reader.IsDBNull(finalOrdinal) ? "" : reader.GetString(finalOrdinal);
                var status = reader.IsDBNull(statusOrdinal) ? "" : reader.GetString(statusOrdinal);
                var invoiceFinalizedDate = DateHelper.FormatSafeDate(reader[finalizedDateOrdinal], true);
                var creator = reader.IsDBNull(creatorOrdinal) ? "" : reader.GetString(creatorOrdinal);
                var changer = reader.IsDBNull(changerOrdinal) ? "" : reader.GetString(changerOrdinal);
                bool paid = !reader.IsDBNull(paidOrdinal) && reader.GetBoolean(paidOrdinal);
                var notes = reader.IsDBNull(notesOrdinal) ? "" : reader.GetString(notesOrdinal);
                var customer = reader.IsDBNull(customerOrdinal) ? "" : reader.GetString(customerOrdinal);
                var currency = reader.IsDBNull(currencyOrdinal) ? "" : reader.GetString(currencyOrdinal);
                var total = reader.GetDouble(totalOrdinal).ToString();
                var invoiceTypeFull = reader.IsDBNull(invoiceTypeOrdinal) ? "" : reader.GetString(invoiceTypeOrdinal);
                var invoiceType = invoiceTypeFull.Length >= 3 ? invoiceTypeFull[..5] : invoiceTypeFull;

                invoices.Add(new FinalInvoiceDto(
                    invoiceGkey,
                    final,
                    status,
                    invoiceFinalizedDate,
                    creator,
                    changer,
                    paid,
                    notes,
                    customer,
                    currency,
                    total,
                    invoiceType
                ));
            }

            return invoices;
        },
        new SqlParameter("@invoiceId", invoiceId),
        new SqlParameter("@finalizedDate", SqlDbType.DateTime)
        {
            Value = DateTime.ParseExact(finalizedDate, "yyyy-MM-dd", CultureInfo.InvariantCulture)
        }
    );

    return result;
}




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


public async Task<FinalInvoiceDto?> GetOneFinalizedInvoiceById(string invoiceFinalNumber)
{
    var query = GetInvoiceQueries.GetOneFinalizedInvoiceById();

    var result = await _database.ExecuteReaderAsync(
        DatabaseConnectionConstants.BillingN4Db,
        query,
        async reader =>
        {
            // Get column ordinals
            int invoiceGkeyOrdinal = reader.GetOrdinal("InvoiceGkey");
            int finalOrdinal = reader.GetOrdinal("Final");
            int statusOrdinal = reader.GetOrdinal("Status");
            int finalizedDateOrdinal = reader.GetOrdinal("FinalizedDate");
            int creatorOrdinal = reader.GetOrdinal("Creator");
            int changerOrdinal = reader.GetOrdinal("Changer");
            int paidOrdinal = reader.GetOrdinal("Paid");
            int notesOrdinal = reader.GetOrdinal("Notes");
            int customerOrdinal = reader.GetOrdinal("Customer");
            int currencyOrdinal = reader.GetOrdinal("Currency");
            int totalOrdinal = reader.GetOrdinal("Total");
            int invoiceTypeOrdinal = reader.GetOrdinal("InvoiceType"); // NEW

            while (await reader.ReadAsync())
            {
                var invoiceGkey = reader.GetInt64(invoiceGkeyOrdinal);
                var final = reader.IsDBNull(finalOrdinal) ? "" : reader.GetString(finalOrdinal);
                var status = reader.IsDBNull(statusOrdinal) ? "" : reader.GetString(statusOrdinal);
                var invoiceFinalizedDate = DateHelper.FormatSafeDate(reader[finalizedDateOrdinal], true);
                var creator = reader.IsDBNull(creatorOrdinal) ? "" : reader.GetString(creatorOrdinal);
                var changer = reader.IsDBNull(changerOrdinal) ? "" : reader.GetString(changerOrdinal);
                bool paid = !reader.IsDBNull(paidOrdinal) && reader.GetBoolean(paidOrdinal);
                var notes = reader.IsDBNull(notesOrdinal) ? "" : reader.GetString(notesOrdinal);
                var customer = reader.IsDBNull(customerOrdinal) ? "" : reader.GetString(customerOrdinal);
                var currency = reader.IsDBNull(currencyOrdinal) ? "" : reader.GetString(currencyOrdinal);
                var total = reader.GetDouble(totalOrdinal).ToString();
                var invoiceTypeFull = reader.IsDBNull(invoiceTypeOrdinal) ? "" : reader.GetString(invoiceTypeOrdinal);
                var invoiceType = invoiceTypeFull.Length >= 3 ? invoiceTypeFull[..5] : invoiceTypeFull;

                return new FinalInvoiceDto(
                    invoiceGkey,
                    final,
                    status,
                    invoiceFinalizedDate,
                    creator,
                    changer,
                    paid,
                    notes,
                    customer,
                    currency,
                    total,
                    invoiceType
                );
            }

            return null;
        },
        new SqlParameter("@invoiceFinalId", invoiceFinalNumber)
    );

    return result;
}


        public async Task<List<InvoiceTypeDto>> LoadAllSTypeInvoices()
        {
            var query = GetInvoiceQueries.LoadAllStypeInvoices();
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

        public async Task<List<InvoiceItemDto>> GetFinalizedInvoiceItems(string invoiceGkey)
        {
            return await _invoiceHelper.GetInvoiceItems(invoiceGkey);
        }


        public async Task<List<SLInvoiceItemDto>> GetSLTypeInvoiceItems(long invoiceGkey)
        {
            string query = SLInvoiceQueries.GetInvoiceItems();

            var result = await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
                query,
                async reader =>
                {
                    var items = new List<SLInvoiceItemDto>();

                    int descriptionOrdinal = reader.GetOrdinal("Description");
                    int quantityOrdinal = reader.GetOrdinal("Quantity");
                    int rateOrdinal = reader.GetOrdinal("Rate");
                    int rateBilledOrdinal = reader.GetOrdinal("RateBilled");
                    int totalOrdinal = reader.GetOrdinal("ItemTotalAmount");
                    int finalNbrOrdinal = reader.GetOrdinal("InvoiceFinalNumber");
                    int notesOrdinal = reader.GetOrdinal("Notes");
                    int finalizedDateOrdinal = reader.GetOrdinal("FinalizedDate");
                    int nameOrdinal = reader.GetOrdinal("Name");
                    int tariffIdOrdinal = reader.GetOrdinal("TariffId");
                    int eventTypeIdOrdinal = reader.GetOrdinal("EventTypeId");

                    while (await reader.ReadAsync())
                    {
                        var item = new SLInvoiceItemDto
                        {
                            Description = reader.IsDBNull(descriptionOrdinal) ? "" : reader.GetString(descriptionOrdinal),
                            Quantity = reader.IsDBNull(quantityOrdinal) ? 0 : reader.GetDouble(quantityOrdinal),
                            Rate = reader.IsDBNull(rateOrdinal) ? 0 : reader.GetDouble(rateOrdinal),
                            RateBilled = reader.IsDBNull(rateBilledOrdinal) ? 0 : reader.GetDouble(rateBilledOrdinal),
                            ItemTotalAmount = reader.IsDBNull(totalOrdinal) ? 0 : reader.GetDouble(totalOrdinal),
                            InvoiceFinalNumber = reader.IsDBNull(finalNbrOrdinal) ? "" : reader.GetString(finalNbrOrdinal),
                            Notes = reader.IsDBNull(notesOrdinal) ? "" : reader.GetString(notesOrdinal),
                            FinalizedDate = reader.IsDBNull(finalizedDateOrdinal) ? DateTime.MinValue : reader.GetDateTime(finalizedDateOrdinal),
                            Name = reader.IsDBNull(nameOrdinal) ? "" : reader.GetString(nameOrdinal),
                            TariffId = reader.IsDBNull(tariffIdOrdinal) ? "" : reader.GetString(tariffIdOrdinal),
                            EventTypeId = reader.IsDBNull(eventTypeIdOrdinal) ? "" : reader.GetString(eventTypeIdOrdinal)
                        };

                        items.Add(item);
                    }

                    return items;
                },
                new SqlParameter("@invoiceGkey", SqlDbType.BigInt) { Value = invoiceGkey }
            );

            return result;
        }

    }
}