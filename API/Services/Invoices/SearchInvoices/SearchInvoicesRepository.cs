
using System.Data;
using System.Globalization;
using API.Dtos.Invoice;
using API.Helper;
using API.Services.Database;
using Microsoft.Data.SqlClient;

namespace API.Services.Invoices.SearchInvoices;

public class SearchInvoicesRepository(IDatabase database) : ISearchInvoices
{
    private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));

    public async Task<List<FinalInvoiceDto>> GetShippingLineInvoicesByFinalizedDate(
        DateTime finalizedDate)
    {
        // Force it to kind=Unspecified to avoid UTC conversion when SQL receives it
        var cleanFinalizedDate = DateTime.SpecifyKind(finalizedDate.Date, DateTimeKind.Unspecified);

        var finalizedDateParam = new SqlParameter("@finalizedDate", SqlDbType.Date)
        {
            Value = cleanFinalizedDate
        };

        var query = SLInvoiceQueries.GetShippingLineInvoicesByFinalizedDate();

        var result = await _database.ExecuteReaderAsync(
            DatabaseConnectionConstants.BillingN4Db,
            query,
            async reader =>
            {
                var invoices = new List<FinalInvoiceDto>();

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
                int invoiceTypeOrdinal = reader.GetOrdinal("InvoiceType");

                while (await reader.ReadAsync())
                {
                    var invoiceGkey = reader.GetInt64(invoiceGkeyOrdinal);
                    var final = reader.IsDBNull(finalOrdinal) ? "" : reader.GetString(finalOrdinal);
                    var status = reader.IsDBNull(statusOrdinal) ? "" : reader.GetString(statusOrdinal);
                    var invoiceFinalizedDate = reader.IsDBNull(finalizedDateOrdinal)
                        ? default
                        : reader.GetDateTime(finalizedDateOrdinal);
                    var creator = reader.IsDBNull(creatorOrdinal) ? "" : reader.GetString(creatorOrdinal);
                    var changer = reader.IsDBNull(changerOrdinal) ? "" : reader.GetString(changerOrdinal);
                    var paid = !reader.IsDBNull(paidOrdinal) && reader.GetBoolean(paidOrdinal);
                    var notes = reader.IsDBNull(notesOrdinal) ? "" : reader.GetString(notesOrdinal);
                    var customer = reader.IsDBNull(customerOrdinal) ? "" : reader.GetString(customerOrdinal);
                    var currency = reader.IsDBNull(currencyOrdinal) ? "" : reader.GetString(currencyOrdinal);
                    var total = reader.IsDBNull(totalOrdinal) ? 0d : reader.GetDouble(totalOrdinal);
                    var invoiceTypeFull = reader.IsDBNull(invoiceTypeOrdinal) ? "" : reader.GetString(invoiceTypeOrdinal);
                    var invoiceType = invoiceTypeFull.Length >= 3 ? invoiceTypeFull[..5] : invoiceTypeFull;
                    WriteLine("Printing the finalized date before adding it to list");
                    WriteLine(invoiceFinalizedDate);
                    
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
            finalizedDateParam
        );

        return result;
    }

    public async Task<List<FinalInvoiceDto>> SearchConsigneeInvoicesByQueryParams(
        string invoiceId, string finalizedDate)
    {
        string query = GetInvoiceQueries.GetConsigneeFinalizedInvoicesByQueryParams();

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
                int invoiceTypeOrdinal = reader.GetOrdinal("InvoiceType");
                while (await reader.ReadAsync())
                {
                    var invoiceGkey = reader.GetInt64(invoiceGkeyOrdinal);
                    var final = reader.IsDBNull(finalOrdinal) ? "" : reader.GetString(finalOrdinal);
                    var status = reader.IsDBNull(statusOrdinal) ? "" : reader.GetString(statusOrdinal);

                    DateTime invoiceFinalizedDate =
                    reader.IsDBNull(finalizedDateOrdinal) ? default :
                    reader.GetDateTime(finalizedDateOrdinal);
                    var creator = reader.IsDBNull(creatorOrdinal) ? "" : reader.GetString(creatorOrdinal);
                    var changer = reader.IsDBNull(changerOrdinal) ? "" : reader.GetString(changerOrdinal);
                    bool paid = !reader.IsDBNull(paidOrdinal) && reader.GetBoolean(paidOrdinal);
                    var notes = reader.IsDBNull(notesOrdinal) ? "" : reader.GetString(notesOrdinal);
                    var customer = reader.IsDBNull(customerOrdinal) ? "" : reader.GetString(customerOrdinal);
                    var currency = reader.IsDBNull(currencyOrdinal) ? "" : reader.GetString(currencyOrdinal);
                    double total = reader.IsDBNull(totalOrdinal) ? 0d : reader.GetDouble(totalOrdinal);


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


    public async Task<FinalInvoiceDto?> SearchFinalizedInvoiceById(string invoiceFinalNumber)
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

                    DateTime invoiceFinalizedDate =
                    reader.IsDBNull(finalizedDateOrdinal) ? default :
                     reader.GetDateTime(finalizedDateOrdinal);

                    var creator = reader.IsDBNull(creatorOrdinal) ? "" : reader.GetString(creatorOrdinal);
                    var changer = reader.IsDBNull(changerOrdinal) ? "" : reader.GetString(changerOrdinal);
                    bool paid = !reader.IsDBNull(paidOrdinal) && reader.GetBoolean(paidOrdinal);
                    var notes = reader.IsDBNull(notesOrdinal) ? "" : reader.GetString(notesOrdinal);
                    var customer = reader.IsDBNull(customerOrdinal) ? "" : reader.GetString(customerOrdinal);
                    var currency = reader.IsDBNull(currencyOrdinal) ? "" : reader.GetString(currencyOrdinal);
                    double total = reader.IsDBNull(totalOrdinal) ? 0d : reader.GetDouble(totalOrdinal);


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

}