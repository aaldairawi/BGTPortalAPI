

using System.Data;
using System.Runtime.CompilerServices;
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
            if (ids.Count == 0) return new();

            var quoted = string.Join(",", ids.Select(id => $"'{id.Replace("'", "''")}'"));
            // var query = $@"SELECT equipment_id AS ContainerNumber, no FROM some_table WHERE equipment_id IN ({quoted})";
            var query = @$"SELECT 
                        t.nominal_length AS ContainerSize, 
                        r.id_full AS ContainerNumber  
                        FROM ref_equipment r
                        JOIN ref_equip_type t ON r.eqtyp_gkey = t.gkey
                        WHERE r.id_full IN ({quoted})";
            var result = new Dictionary<string, string>();
            await _database.ExecuteReaderAsync(Database.SparcsN4, query, async reader =>
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


        public async Task<string> RetrieveBerthAssignedToInvoice(string unitFacilityVisitGkey)
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
        public async Task<string> GetUnitFacilityVisitGkey(string invoiceGkey)
        {
            var query = InvoiceQueries.GetUnitFacilityGkeyFromParmValues();
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

        public async Task<string> GetRefValue(string refId)
        {
            var query = InvoiceQueries.GetRefValueFromBgtReference();
            return await _database.ExecuteReaderAsync(Database.BGTPortalDb, query, async reader =>
            {
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        return reader["RefValue"].ToString() ?? "";
                    }
                }
                return string.Empty;
            }, new SqlParameter("@refId", refId));
        }

        public async Task<string> GetInvoiceGkeyFromBillingInvoices(string invoiceFinalNumber)
        {
            var query = InvoiceQueries.GetInvoiceGkeyFromBillingInvoices();
            return await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
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
            var query = InvoiceQueries.GetCustomerNameBasedOnInvoiceFinalNumber();
            return await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
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
            var query = InvoiceQueries.GetInvoiceTotalAmount();
            return await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
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
            var query = InvoiceQueries.GetInvoiceFinalizedDate();
            return await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
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
            WriteLine($"The invoice gkey is {invoiceGkey}  - From GetInvoiceItems Helper Repository");

            var query = InvoiceQueries.GetInvoiceItems();
            var invoiceItems = await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {
                var items = new List<InvoiceItemDto>();

                while (await reader.ReadAsync())
                {
                    items.Add(new InvoiceItemDto
                    {
                        InvoiceItemGkey = reader["InvoiceItemGkey"].ToString() ?? "",
                        InvoiceFinalNumber = reader["InvoiceFinalNumber"].ToString() ?? "",
                        ContainerId = reader["ContainerId"].ToString() ?? "",
                        EventTypeId = reader["ChargeableUnitEvent"].ToString() ?? "",

                        ItemTotalAmount = reader["Amount"] != DBNull.Value ? Convert.ToDouble(reader["Amount"]).ToString("F0") : "0",


                        Quantity = reader["Quantity"] != DBNull.Value ? Convert.ToInt32(reader["Quantity"]) : 0,
                        QuantityBilled = reader["QuantityBilled"] != DBNull.Value ? Convert.ToInt32(reader["QuantityBilled"]) : 0,
                        Description = reader["Description"].ToString() ?? "",
                        FinalizedDate = reader["FinalizedDate"].ToString() ?? "",
                        GLCode = reader["GlCode"].ToString() ?? ""
                    });
                }
                return items;
            }, new SqlParameter("@invoiceGkey", invoiceGkey));

            return invoiceItems;
        }

        public async Task<InvoiceCurrencyAndNotesDto> GetInvoiceCurrencyAndNotes(string invoiceFinalNbr)
        {
            var query = InvoiceQueries.GetInvoiceCurrencyAndNotes();
            return await _database.ExecuteReaderAsync(Database.BillingN4Db, query, async reader =>
            {

                while (await reader.ReadAsync())
                {

                    var currency = reader["Currency"].ToString() ?? "";
                    var notes = reader["InvoiceNotes"].ToString() ?? "";
                    return new InvoiceCurrencyAndNotesDto(currency, notes);
                }

                return null!;

            }, new SqlParameter("@invoiceFinalNumber", invoiceFinalNbr));

        }

        public async Task<List<InvoiceMetaDataDto>> GetInvoiceMetaData(List<string> invoiceFinalNumbers)
        {
            if (invoiceFinalNumbers == null || invoiceFinalNumbers.Count == 0)
                return [];

            var quoted = string.Join(",", invoiceFinalNumbers.Select(n => $"'{n.Replace("'", "''")}'"));

            WriteLine(quoted);

            var query = InvoiceQueries.GetInvoiceMetaData()
                .Replace("--__INVOICE_FILTER__", $"WHERE i.final_nbr IN ({quoted})");

            return await _database.ExecuteReaderAsync(Database.BillingN4Db, query,
                async reader =>
                {
                    var list = new List<InvoiceMetaDataDto>();

                    while (await reader.ReadAsync())
                    {
                        list.Add(new InvoiceMetaDataDto
                        {
                            InvoiceFinalNumber = reader["InvoiceFinalNumber"].ToString()!,
                            InvoiceFinalizedDate = Convert.ToDateTime(reader["InvoiceFinalizedDate"]),
                            CustomerName = reader["CustomerName"].ToString()!,
                            CustomerSapCode = reader["CustomerSapCode"].ToString()!,
                            TotalAmount = reader["TotalAmount"] != DBNull.Value
                                ? Convert.ToDouble(reader["TotalAmount"]).ToString("F0")
                                : "0",
                            UnitFacilityVisitGkey = reader["UnitFacilityVisitGkey"].ToString()!,
                            ProfitCenter = reader["ProfitCenter"].ToString()!,
                            InvoiceCurrency = reader["InvoiceCurrency"].ToString()!,
                            InvoiceNotes = reader["InvoiceNotes"].ToString()!
                        });
                    }

                    return list;
                });
        }


    }

}