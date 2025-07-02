
using System.Data;

using API.Dtos.InvoiceUpload;
using API.Helper;
using Microsoft.Data.SqlClient;

namespace API.Services.UploadInvoices
{
    public class UploadInvoicesHelperRepository(IConfiguration configuration) : IUploadInvoicesHelper
    {
        private readonly IConfiguration _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

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
            var query = InvoiceMetaDataQueries.BillingInvoiceMetaData();
            //.Replace("--__INVOICE_FILTER__", "JOIN #TempInvoices t ON t.final_nbr = i.final_nbr");


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


        public async Task<decimal?> GetIQDtoUSDRateAsync()
        {
            const string query = @"
            SELECT ref_value
            FROM bgt_reference
            WHERE ref_id = 'IQDtoUSDrate'";

            var connectionString = _configuration.GetConnectionString(DatabaseConnectionConstants.BGTPortalDBServerThirteenDatabaseConnection);

            using var connection = new SqlConnection(connectionString);
            using var command = new SqlCommand(query, connection);

            await connection.OpenAsync();

            var result = await command.ExecuteScalarAsync();

            if (result != null && decimal.TryParse(result.ToString(), out var rate))
            {
                return rate;
            }

            return null;
        }

        public async Task<InvoiceBillingMetaDataDto?> GetShippingLineInvoiceBillingMetaDataDto(string invoiceFinalNumber,
         string berth)
        {
            var query = InvoiceMetaDataQueries.GetBillingInvoiceMetaDataFromNavisIntegrationInvoiceItemView();

            using var connection = new SqlConnection(_configuration.GetConnectionString(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection));
            await connection.OpenAsync();

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@invoiceFinalNumber", invoiceFinalNumber);
            command.Parameters.AddWithValue("@berth", berth);

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                var dto = new InvoiceBillingMetaDataDto
                {
                    InvoiceFinalNumber = reader["InvoiceFinalNumber"]?.ToString() ?? "",
                    InvoiceFinalizedDate = reader.IsDBNull(reader.GetOrdinal("InvoiceFinalizedDate"))
                        ? default
                        : reader.GetDateTime(reader.GetOrdinal("InvoiceFinalizedDate")),
                    InvoiceNotes = reader["InvoiceNotes"]?.ToString() ?? "",
                    CustomerName = reader["CustomerName"]?.ToString() ?? "",
                    CustomerGkey = reader["CustomerGkey"]?.ToString() ?? "",
                    InvoiceCurrency = reader["InvoiceCurrency"]?.ToString() ?? "USD",
                    Berth = reader["Berth"]?.ToString() ?? "",
                    TotalAmount = reader.IsDBNull(reader.GetOrdinal("TotalAmount"))
                        ? 0.0
                        : Convert.ToDouble(reader["TotalAmount"])
                };

                dto.TrimFields();
                return dto;
            }

            return null;
        }



        public async Task EnrichShippingLineBillingMetaDto(InvoiceBillingMetaDataDto dto)
        {
            if (dto == null) return;
            var sapCodeQuery = @"
                SELECT cust_sap_number
                FROM dbo.customer_SapDetails
                WHERE cust_gkey = @customerGkey";


            using SqlConnection connection = new(
                _configuration.GetConnectionString(DatabaseConnectionConstants.BGTPortalDBServerThirteenDatabaseConnection));
            await connection.OpenAsync();

            using SqlCommand command = new(sapCodeQuery, connection);
            command.Parameters.AddWithValue("@customerGkey", dto.CustomerGkey?.Trim() ?? string.Empty);
            var sapCode = await command.ExecuteScalarAsync();
            dto.CustomerSapCode = sapCode?.ToString() ?? "";



            // --- 2. Profit Center Mapping from Berth ---
            dto.ProfitCenter = dto.Berth switch
            {
                "B27" => "5000",
                "B20" => "4000",
                _ => "UNKNOWN"
            };

        }


        public async Task<InvoiceBillingMetaDataSL4Dto?> GetShippingLineInvoiceSL4BillingMetaDataDto(string invoiceFinalNumber,
         string berth)
        {
            var query = InvoiceMetaDataQueries.GetBillingInvoiceMetaDataFromNavisIntegrationInvoiceItemView();

            using var connection = new SqlConnection(_configuration.GetConnectionString(DatabaseConnectionConstants.BGTPortalN4DatabaseConnection));
            await connection.OpenAsync();

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@invoiceFinalNumber", invoiceFinalNumber);
            command.Parameters.AddWithValue("@berth", berth);

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                var dto = new InvoiceBillingMetaDataSL4Dto
                {
                    InvoiceFinalNumber = reader["InvoiceFinalNumber"]?.ToString() ?? "",
                    InvoiceFinalizedDate = reader.IsDBNull(reader.GetOrdinal("InvoiceFinalizedDate"))
                        ? default
                        : reader.GetDateTime(reader.GetOrdinal("InvoiceFinalizedDate")),
                    InvoiceNotes = reader["InvoiceNotes"]?.ToString() ?? "",
                    CustomerGkey = reader["CustomerGkey"]?.ToString() ?? "",
                    InvoiceCurrency = reader["InvoiceCurrency"]?.ToString() ?? "USD",
                    Berth = reader["Berth"]?.ToString() ?? "",
                    TotalAmount = reader.IsDBNull(reader.GetOrdinal("TotalAmount"))
                        ? 0.0
                        : Convert.ToDouble(reader["TotalAmount"])
                };
                dto.TrimFields();
                return dto;
            }

            return null;
        }


        public async Task EnrichShippingLineSL4BillingMetaDto(InvoiceBillingMetaDataSL4Dto dto)
        {
            if (dto == null) return;
            var sapCodeQuery = @"
                SELECT cust_sap_number
                FROM dbo.customer_SapDetails
                WHERE cust_gkey = @customerGkey";


            using SqlConnection connection = new(
                _configuration.GetConnectionString(DatabaseConnectionConstants.BGTPortalDBServerThirteenDatabaseConnection));
            await connection.OpenAsync();

            using SqlCommand command = new(sapCodeQuery, connection);
            command.Parameters.AddWithValue("@customerGkey", dto.CustomerGkey?.Trim() ?? string.Empty);
            var sapCode = await command.ExecuteScalarAsync();
            dto.CustomerSapCode = sapCode?.ToString() ?? "";



            // --- 2. Profit Center Mapping from Berth ---
            dto.ProfitCenter = dto.Berth switch
            {
                "B27" => "5000",
                "B20" => "4000",
                _ => "UNKNOWN"
            };

        }






    }
}