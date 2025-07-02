


using API.Helper;
using API.Services.Database;
using Microsoft.Data.SqlClient;

namespace API.Services.Invoices.InvoiceHelper;

public class InvoiceGeneralInfoRepository(IDatabase database) : IInvoiceGeneralInfo
{
    private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));

    public async Task<long> GetInvoiceGkeyFromBillingInvoices(string invoiceFinalNumber)
    {

        var query = InvoiceHelperQueries.GetInvoiceGkeyFromBillingInvoices();
        SqlParameter[] parameter = [new("@invoiceFinalNumber", invoiceFinalNumber)];

        return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
        {
            var gkeyIndex = reader.GetOrdinal("InvoiceGkey");
            while (await reader.ReadAsync())
            {
                long gkey = reader.IsDBNull(gkeyIndex) ? 0L : reader.GetInt64(gkeyIndex);
                return gkey;
            }
            return 0L;

        }, parameter);
    }


    public async Task<decimal> GetInvoiceTotalAmount(string invoiceFinalNumber)
    {
        var query = InvoiceHelperQueries.GetInvoiceTotalAmount();
        SqlParameter[] parameters = [new("@invoiceFinalNumber", invoiceFinalNumber)];

        return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
        {
            var totalAmountIndex = reader.GetOrdinal("TotalAmount");

            while (await reader.ReadAsync())
            {
                return reader.IsDBNull(totalAmountIndex)
                    ? 0m
                    : reader.GetDecimal(totalAmountIndex);
            }
            return 0m;
        }, parameters);
    }


    public async Task<DateTime> GetInvoiceFinalizedDate(string invoiceFinalNumber)
    {
        var query = InvoiceHelperQueries.GetInvoiceFinalizedDate();
        SqlParameter[] parameters = [new("@invoiceFinalNbr", invoiceFinalNumber)];

        return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
        {
            var finalizedDateIndex = reader.GetOrdinal("FinalizedDate");
            while (await reader.ReadAsync())
            {
                return reader.IsDBNull(finalizedDateIndex) ? default :
                reader.GetDateTime(finalizedDateIndex);
            }
            return default;
        }, parameters);
    }



}