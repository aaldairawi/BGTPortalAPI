
using System.Data;
using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;
using API.Helper;
using Microsoft.Data.SqlClient;

namespace API.Services.Invoices
{
    public class UploadInvoicesHelperRepository : IUploadInvoicesHelper
    {
        private readonly IConfiguration _configuration;

        public UploadInvoicesHelperRepository(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

        }
        public DataTable CreateInvoiceNumberTempTable(List<string> invoices)
        {
            DataTable table = new();
            table.Columns.Add("final_nbr", typeof(string));

            foreach (var number in invoices)
            {
                table.Rows.Add(number);
            }

            return table;
        }

        public async Task<List<InvoiceBillingMetaDataDto>> GetInvoiceBillingMetaDataWithTempTableAsync(List<string> invoiceFinalNumbers)
        {
            var dt = CreateInvoiceNumberTempTable(invoiceFinalNumbers);

            using var connection = new SqlConnection(_configuration.GetConnectionString(DatabaseConnectionConstants.BillingN4Db));
            await connection.OpenAsync();

            using var transaction = connection.BeginTransaction();

            // Create temp table
            var createTempTableCmd = new SqlCommand(
                "CREATE TABLE #TempInvoices (final_nbr NVARCHAR(50));", connection, transaction);


            await createTempTableCmd.ExecuteNonQueryAsync();

            // Bulk insert
            using (var bulkCopy = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, transaction))
            {
                bulkCopy.DestinationTableName = "#TempInvoices";
                await bulkCopy.WriteToServerAsync(dt);
            }

            // Run the query
            var query = InvoiceMetaDataQueries.BillingInvoiceMetaData()
                .Replace("--__INVOICE_FILTER__", "JOIN #TempInvoices t ON t.final_nbr = i.final_nbr");

            using var command = new SqlCommand(query, connection, transaction);
            command.CommandTimeout = 180;
            using var reader = await command.ExecuteReaderAsync();

            var results = new List<InvoiceBillingMetaDataDto>();
            int ordinalFinalNumber = reader.GetOrdinal("InvoiceFinalNumber");
            int ordinalFinalizedDate = reader.GetOrdinal("InvoiceFinalizedDate");
            int ordinalInvoiceNotes = reader.GetOrdinal("InvoiceNotes");
            int ordinalCustomerName = reader.GetOrdinal("CustomerName");
            int ordinalCurrency = reader.GetOrdinal("InvoiceCurrency");
            int ordinalAmount = reader.GetOrdinal("TotalAmount");
            int ordinalBerth = reader.GetOrdinal("Berth");

            while (await reader.ReadAsync())
            {


                var finalNumber = reader.IsDBNull(ordinalFinalNumber) ? "" : reader.GetString(ordinalFinalNumber);
                var finalizedDate = reader.IsDBNull(ordinalFinalizedDate) ? default : reader.GetDateTime(ordinalFinalizedDate);
                var invoiceNotes = reader.IsDBNull(ordinalInvoiceNotes) ? "" : reader.GetString(ordinalInvoiceNotes);
                var customerName = reader.IsDBNull(ordinalCustomerName) ? "" : reader.GetString(ordinalCustomerName);
                var currency = reader.IsDBNull(ordinalCurrency) ? "" : reader.GetString(ordinalCurrency);
                var berth = reader.IsDBNull(ordinalBerth) ? "" : reader.GetString(ordinalBerth);
                var amount = reader.IsDBNull(ordinalAmount) ? 0.0 : Convert.ToDouble(reader[ordinalAmount]);

                var dto = new InvoiceBillingMetaDataDto
                {
                    InvoiceFinalNumber = finalNumber,
                    InvoiceFinalizedDate = finalizedDate,
                    InvoiceNotes = invoiceNotes,
                    CustomerName = customerName,
                    InvoiceCurrency = currency,
                    Berth = berth,
                    TotalAmount = amount
                };
                dto.TrimFields();
                results.Add(dto);
            }
            await reader.CloseAsync();
            transaction.Commit();

            return results;
        }
        public async Task EnrichBillingMetaDto(List<InvoiceBillingMetaDataDto> invoices)
        {
            var uniqueCustomerNames = invoices
                .Select(dto => dto.CustomerName)
                .Distinct()
                .ToList();

            var uniqueProfitCenterKeys = invoices
                .Select(dto => dto.ProfitCenterText()) // You already have this helper
                .Distinct()
                .ToList();

            // Get SAP codes for customer names
            var sapCodeMap = await GetCustomerSapCodeMap(uniqueCustomerNames);

            // Get profit centers for berth values (profit center keys)
            var profitCenterMap = await GetProfitCenterMap(uniqueProfitCenterKeys);

            // Assign values to each DTO
            foreach (var dto in invoices)
            {
                sapCodeMap.TryGetValue(dto.CustomerName.Trim(), out var sapCode);
                profitCenterMap.TryGetValue(dto.ProfitCenterText(), out var profitCenter);

                dto.CustomerSapCode = sapCode;
                dto.ProfitCenter = profitCenter;
            }
        }

        private async Task<Dictionary<string, string>> GetCustomerSapCodeMap(List<string> customerNames)
        {
            var result = new Dictionary<string, string>();

            var parameters = customerNames
                .Select((name, index) => new SqlParameter($"@name{index}", name))
                .ToList();

            var inClause = string.Join(", ", parameters.Select(p => p.ParameterName));
            //var query = InvoiceHelperQueries.GetCustomerSapCodeQuery();

            var query = $@"
        SELECT TRIM(consignee_name) AS CustomerName, sap_code AS CustomerSapCode
        FROM dbo.consignee_SAPdetails
        WHERE TRIM(consignee_name) IN ({inClause})";

            using var connection = new SqlConnection(_configuration.GetConnectionString(DatabaseConnectionConstants.BGTPortalDBServerThirteenDatabaseConnection));
            await connection.OpenAsync();
            using var command = new SqlCommand(query, connection);

            command.Parameters.AddRange(parameters.ToArray());

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var name = reader["CustomerName"].ToString() ?? "";
                var sapCode = reader["CustomerSapCode"].ToString() ?? "";
                result[name] = sapCode;
            }

            return result;
        }

        private async Task<Dictionary<string, string>> GetProfitCenterMap(List<string> profitCenterKeys)
        {
            var result = new Dictionary<string, string>();

            var parameters = profitCenterKeys
                .Select((key, index) => new SqlParameter($"@key{index}", key))
                .ToList();

            var inClause = string.Join(", ", parameters.Select(p => p.ParameterName));

            var query = $@"
                    SELECT ref_id AS ProfitCenterKey, ref_value AS ProfitCenter
                    FROM dbo.bgt_reference
                    WHERE ref_id IN ({inClause});

    ";

            using var connection = new SqlConnection(_configuration.GetConnectionString(DatabaseConnectionConstants.BGTPortalDBServerThirteenDatabaseConnection));
            await connection.OpenAsync();

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddRange(parameters.ToArray());

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var key = reader["ProfitCenterKey"].ToString() ?? "";
                var value = reader["ProfitCenter"].ToString() ?? "";
                result[key] = value;
            }

            return result;
        }








    }
}