
using API.Helper;

using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class IInvoiceHelperRepository : IInvoiceHelper
    {
        private readonly IDatabase _database;
        public IInvoiceHelperRepository(IDatabase database)
        {
            _database = database ?? throw new ArgumentNullException(nameof(database));
        }
        public async Task<string> GetContainerSize(string containerId)
        {
            var query = Container_SQL_Queries.GetContainerSizeQuery();
            return await _database.ExecuteReaderAsync(Database.SparcsN4, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        return reader["ContainerSize"].ToString() ?? "";
                    }
                }
                return string.Empty;
            }, new SqlParameter("@containerId", containerId));

        }

        public async Task<string> GetCustomerSapCode(string customerName)
        {
            var query = InvoiceQueries.GetCustomerSapCodeQuery();
            return await _database.ExecuteReaderAsync(Database.BGTPortalDb, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        var customerSapCode = reader["CustomerSapCode"].ToString() ?? "";
                        return customerSapCode;
                    }
                }
                return string.Empty;
            }, new SqlParameter("@customerName", customerName));
        }

        public async Task<string> RetrieveBerthAssignedToInvoice(int unitFacilityVisitGkey)
        {
            string query = InvoiceQueries.RetrieveBerthAssignedToInvoice();
            return await _database.ExecuteReaderAsync(Database.SparcsN4, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        return reader["Berth"].ToString() ?? "";
                    }
                }
                return string.Empty;
            }, new SqlParameter("@unitFacilityVisitGkey", unitFacilityVisitGkey));
        }
        public async Task<string> GetUnitFacilityVisitGkey(int invoiceGkey)
        {
            var query = InvoiceQueries.GetInvoiceGkeyFromParmValues();
            return await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        return reader["Value"].ToString() ?? "";
                    }
                }
                return string.Empty;
            }, new SqlParameter("@invoiceGkey", invoiceGkey));

        }
    }
}