

using System.Data;
using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;
using API.Helper;
using API.Services.Database;
using Microsoft.Data.SqlClient;

namespace API.Services.Invoices.InvoiceHelper
{
    public class InvoiceHelperRepository(IDatabase database) : IInvoiceHelper
    {
        private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));

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


        public async Task<List<InvoiceItemDto>> GetConsigneeInvoiceItems(long invoiceGkey)
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


        public async Task<List<SLInvoiceCsvLineDto>>
        GetSLInvoiceItemsByFinalNumber(string invoiceFinalNumber)
        {
            var query = SLInvoiceQueries.GetSLInvoiceItemsByFinalNumber();

            var items = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
            {
                var results = new List<SLInvoiceCsvLineDto>();

                int finalNbrOrdinal = reader.GetOrdinal("InvoiceFinalNumber");
                int glCodeOrdinal = reader.GetOrdinal("GlCode");
                int tariffIdOrdinal = reader.GetOrdinal("TariffId");
                int quantityOrdinal = reader.GetOrdinal("Quantity");
                int itemTotalOrdinal = reader.GetOrdinal("ItemTotalAmount");

                while (await reader.ReadAsync())
                {
                    var item = new SLInvoiceCsvLineDto
                    {
                        InvoiceFinalNumber = reader.IsDBNull(finalNbrOrdinal) ? "" : reader.GetString(finalNbrOrdinal),
                        GlCode = reader.IsDBNull(glCodeOrdinal) ? "" : reader.GetString(glCodeOrdinal),
                        TariffId = reader.IsDBNull(tariffIdOrdinal) ? "" : reader.GetString(tariffIdOrdinal),

                        // Fix here: both Qnty and Total are SQL float => use GetDouble()
                        Quantity = reader.IsDBNull(quantityOrdinal) ? 0 : (int)Math.Round(reader.GetDouble(quantityOrdinal)),
                        ItemTotalAmount = reader.IsDBNull(itemTotalOrdinal) ? 0 : Convert.ToDecimal(reader.GetDouble(itemTotalOrdinal))
                    };

                    results.Add(item);
                }

                return results;
            }, new SqlParameter("@invoiceFinalNumber", invoiceFinalNumber));

            return items;
        }


        // Migt delete in production.

        // public async Task<List<SLInvoiceCsvLineDto>>
        // GetSL4InvoiceItemsByFinalNumber(string invoiceFinalNumber
        // )
        // {
        //     var query = SLInvoiceQueries.GetInvoiceNoteByFinalNumber;

        //     var items = await _database.ExecuteReaderAsync(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection, query, async reader =>
        //     {
        //         var results = new List<SLInvoiceCsvLineDto>();

        //         int finalNbrOrdinal = reader.GetOrdinal("InvoiceFinalNumber");
        //         int glCodeOrdinal = reader.GetOrdinal("GlCode");
        //         int tariffIdOrdinal = reader.GetOrdinal("TariffId");
        //         int quantityOrdinal = reader.GetOrdinal("Quantity");
        //         int itemTotalOrdinal = reader.GetOrdinal("ItemTotalAmount");

        //         while (await reader.ReadAsync())
        //         {
        //             var item = new SLInvoiceCsvLineDto
        //             {
        //                 InvoiceFinalNumber = reader.IsDBNull(finalNbrOrdinal) ? "" : reader.GetString(finalNbrOrdinal),
        //                 GlCode = reader.IsDBNull(glCodeOrdinal) ? "" : reader.GetString(glCodeOrdinal),
        //                 TariffId = reader.IsDBNull(tariffIdOrdinal) ? "" : reader.GetString(tariffIdOrdinal),

        //                 // Fix here: both Qnty and Total are SQL float => use GetDouble()
        //                 Quantity = reader.IsDBNull(quantityOrdinal) ? 0 : (int)Math.Round(reader.GetDouble(quantityOrdinal)),
        //                 ItemTotalAmount = reader.IsDBNull(itemTotalOrdinal) ? 0 : Convert.ToDecimal(reader.GetDouble(itemTotalOrdinal))
        //             };

        //             results.Add(item);
        //         }

        //         return results;
        //     }, new SqlParameter("@invoiceFinalNumber", invoiceFinalNumber));

        //     return items;
        // }

        public async Task<List<Sl4InvoiceItemCsvDto?>>
        GetSL4InvoiceLineItemsCsv(string parentInvoiceNumber,
        string partnerInvoiceNumber)
        {
            WriteLine("Get SL4 Invoice Line Items");
            List<Sl4InvoiceItemCsvDto?> result = [];

            Sl4InvoiceItemCsvDto? firstLine = await
            GetFirstSL4InvoiceCsvItem(parentInvoiceNumber, partnerInvoiceNumber);
            WriteLine("Done with first line");

            Sl4InvoiceItemCsvDto? secondLine = await
            GetSecondSL4InvoiceCsvItem(partnerInvoiceNumber);
            WriteLine("Done with second line");

            if (firstLine is null || secondLine is null) return null!;

            secondLine.TotalInvoiceLineAmount = firstLine.TotalInvoiceLineAmount -  secondLine.TotalInvoiceLineAmount;



            result.Add(firstLine);
            result.Add(secondLine);

            WriteLine("Done with sl4 items csv");
            return result;

        }


        private async Task<Sl4InvoiceItemCsvDto?> GetFirstSL4InvoiceCsvItem(
            string parentInvoiceNumber, string partnerInvoiceNumber)
        {

            var query = SLInvoiceQueries.GetSL4FirstCsvLineItem();
            SqlParameter[] parameters = [new("@parentInvoiceNumber", parentInvoiceNumber)];

            var result = await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
                query, async reader =>
                {

                    int notesIndex = reader.GetOrdinal("Notes");
                    int totalIndex = reader.GetOrdinal("TotalInvoiceLineAmount");
                    while (await reader.ReadAsync())
                    {

                        string notes = reader.IsDBNull(notesIndex) ? "" :
                        reader.GetString(notesIndex);
                        double total = reader.IsDBNull(totalIndex) ?
                        0 : reader.GetDouble(totalIndex);
                        return new Sl4InvoiceItemCsvDto()
                        {
                            FinalNumber = partnerInvoiceNumber,
                            GlCode = "70003700",
                            Notes = notes,
                            TotalInvoiceLineAmount = total
                        };
                    }
                    return null;
                }, parameters);
            return result;
        }



        private async Task<Sl4InvoiceItemCsvDto?> GetSecondSL4InvoiceCsvItem(
            string partnerInvoiceNumber)
        {
            var query = SLInvoiceQueries.GetSL4SecondCsvLineItem();
            SqlParameter[] parameters = [new("@partnerInvoiceNumber", partnerInvoiceNumber)];

            var result = await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
                query, async reader =>
                {
                    int finalNumberIndex = reader.GetOrdinal("FinalNumber");
                    int notesIndex = reader.GetOrdinal("Notes");
                    int totalIndex = reader.GetOrdinal("TotalInvoiceLineAmount");
                    while (await reader.ReadAsync())
                    {
                        string finalNumber = reader.IsDBNull(finalNumberIndex)
                        ? "" : reader.GetString(finalNumberIndex);
                        string notes = reader.IsDBNull(notesIndex) ? "" :
                        reader.GetString(notesIndex);
                        double total = reader.IsDBNull(totalIndex) ?
                        0 : reader.GetDouble(totalIndex);
                        return new Sl4InvoiceItemCsvDto()
                        {
                            FinalNumber = finalNumber,
                            GlCode = "40000807",
                            Notes = notes,
                            TotalInvoiceLineAmount = total
                        };
                    }
                    return null;
                }, parameters);
            return result;
        }





    }
}

