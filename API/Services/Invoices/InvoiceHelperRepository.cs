

using System.Data;
using API.Dtos.Invoice;
using API.Helper;

using Microsoft.Data.SqlClient;

namespace API.Services.Invoices
{
    public class InvoiceHelperRepository : IInvoiceHelper
    {
        private readonly IDatabase _database;
        public InvoiceHelperRepository(IDatabase database)
        {
            _database = database ?? throw new ArgumentNullException(nameof(database));
        }
        public async Task<Dictionary<string, string>> GetContainerSize(IEnumerable<string> containerIds)
        {
            var ids = containerIds.Distinct().ToList();
            if (ids.Count == 0) return [];

            var quoted = string.Join(",", ids.Select(id => $"'{id.Replace("'", "''")}'"));

            var query = @$"SELECT 
                        t.nominal_length AS ContainerSize, 
                        r.id_full AS ContainerNumber  
                        FROM ref_equipment r
                        JOIN ref_equip_type t ON r.eqtyp_gkey = t.gkey
                        WHERE r.id_full IN ({quoted})";

            var result = new Dictionary<string, string>();
            await _database.ExecuteReaderAsync(DatabaseConnectionConstants.SparcsN4, query, async reader =>
            {
                while (await reader.ReadAsync())
                {
                    result[reader["ContainerNumber"].ToString()!] = reader["ContainerSize"].ToString()!;
                }
                return result;
            });

            return result;
        }





        public async Task<string> GetCustomerSapCode(string customerName)
        {
            var query = InvoiceHelperQueries.GetCustomerSapCodeQuery();
            return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalDBServerThirteenDatabaseConnection, query, async reader =>
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


        public async Task<string> RetrieveBerthAssignedToInvoice(string unitFacilityVisitGkey)
        {
            string query = InvoiceHelperQueries.RetrieveBerthAssignedToInvoice();
            return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.SparcsN4, query, async reader =>
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
        public async Task<string> GetUnitFacilityVisitGkey(string invoiceGkey)
        {
            var query = InvoiceHelperQueries.GetUnitFacilityGkeyFromParmValues();
            return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
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



        public async Task<string> GetInvoiceGkeyFromBillingInvoices(string invoiceFinalNumber)
        {
            var query = InvoiceHelperQueries.GetInvoiceGkeyFromBillingInvoices();
            return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        return reader["InvoiceGkey"].ToString() ?? "";
                    }
                }
                return string.Empty;
            }, new SqlParameter("@invoiceFinalNumber", invoiceFinalNumber));
        }

        public async Task<string> GetCustomerNameBasedOnInvoiceFinalNumber(string invoiceFinalNumber)
        {
            var query = InvoiceHelperQueries.GetCustomerNameBasedOnInvoiceFinalNumber();
            return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        return reader["CustomerName"].ToString() ?? "";
                    }
                }

                return string.Empty;
            }, new SqlParameter("@invoiceFinalNumber", invoiceFinalNumber));

        }

        public async Task<string> GetInvoiceTotalAmount(string invoiceFinalNumber)
        {
            var query = InvoiceHelperQueries.GetInvoiceTotalAmount();
            return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        var total = reader["TotalAmount"] != DBNull.Value ? Convert.ToDouble(reader["TotalAmount"]).ToString("F0") : "0";
                    }
                }

                return string.Empty;
            }, new SqlParameter("@invoiceFinalNumber", invoiceFinalNumber));
        }

        public async Task<string> GetInvoiceFinalizedDate(string invoiceFinalNumber)
        {
            var query = InvoiceHelperQueries.GetInvoiceFinalizedDate();
            return await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        return reader["FinalizedDate"].ToString() ?? "";
                    }
                }
                return string.Empty;
            }, new SqlParameter(@"invoiceFinalNbr", invoiceFinalNumber));
        }



        public async Task<List<InvoiceItemDto>> GetInvoiceItems(string invoiceGkey)
        {
            var query = GetInvoiceQueries.GetInvoiceItems();
            var invoiceItems = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BillingN4Db, query, async reader =>
            {
                var items = new List<InvoiceItemDto>();

                int gkeyOrdinal = reader.GetOrdinal("InvoiceItemGkey");
                int finalNbrOrdinal = reader.GetOrdinal("InvoiceFinalNumber");
                int containerIdOrdinal = reader.GetOrdinal("ContainerId");
                int eventTypeOrdinal = reader.GetOrdinal("ChargeableUnitEvent");

                int amountOrdinal = reader.GetOrdinal("Total");
                int quantityOrdinal = reader.GetOrdinal("Quantity");
                int quantityBilledOrdinal = reader.GetOrdinal("QuantityBilled");
                int descriptionOrdinal = reader.GetOrdinal("Description");

                int finalizedDateOrdinal = reader.GetOrdinal("InvoiceFinalizedDate");
                int glCodeOrdinal = reader.GetOrdinal("GlCode");
                int rate = reader.GetOrdinal("Rate");

                while (await reader.ReadAsync())
                {
                    items.Add(new InvoiceItemDto
                    {
                        InvoiceItemGkey = reader.IsDBNull(gkeyOrdinal) ? "" : reader.GetInt64(gkeyOrdinal).ToString(),
                        InvoiceFinalNumber = reader.IsDBNull(finalNbrOrdinal) ? "" : reader.GetString(finalNbrOrdinal),
                        ContainerId = reader.IsDBNull(containerIdOrdinal) ? "" : reader.GetString(containerIdOrdinal),
                        EventTypeId = reader.IsDBNull(eventTypeOrdinal) ? "" : reader.GetString(eventTypeOrdinal),
                        ItemTotalAmount = reader.IsDBNull(amountOrdinal) ? 0 : reader.GetDouble(amountOrdinal),
                        Quantity = reader.IsDBNull(quantityOrdinal) ? 0 : reader.GetDouble(quantityOrdinal),
                        QuantityBilled = reader.IsDBNull(quantityBilledOrdinal) ? 0 : reader.GetDouble(quantityBilledOrdinal),
                        Description = reader.IsDBNull(descriptionOrdinal) ? "" : reader.GetString(descriptionOrdinal),
                        FinalizedDate = reader.IsDBNull(finalizedDateOrdinal) ? DateTime.MinValue : reader.GetDateTime(finalizedDateOrdinal),
                        GLCode = reader.IsDBNull(glCodeOrdinal) ? "" : reader.GetString(glCodeOrdinal),
                        Rate = reader.IsDBNull(rate) ? 0 : reader.GetDouble(rate)
                    });
                }

                return items;
            }, new SqlParameter("@invoiceGkey", invoiceGkey));

            return invoiceItems;
        }



    }

}