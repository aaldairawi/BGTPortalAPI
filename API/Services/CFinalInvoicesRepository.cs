

using API.Dtos.CtypeInvoice;
using API.Extensions;
using API.Helper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;


namespace API.Services
{
    public class CFinalInvoicesRepository : ICFinalInvoices
    {
        
        private readonly IConfiguration _configuration;
        public CFinalInvoicesRepository( IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }
        public async Task<CTypeFinalInvoiceResponse> GetAllCTypeFinalizedInvoices(string invoiceType, DateTime finalizedDate)
        {
            string query = Container_SQL_Queries.GetAllFinalizedInvoicesQuery();
            CTypeFinalInvoiceResponse response = new();
            List<CTypeFinalInvoiceDto> invoicesFinalizedList = [];
            using (SqlConnection connection = new(_configuration.GetConnectionString("BillingN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@finalizedDate", finalizedDate.ToString("yyyy-MM-dd"));
                    command.Parameters.AddWithValue("@invoiceType", invoiceType);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                var invoiceGkey = reader["InvoiceGkey"].ToString() ?? "";
                                var draft = reader["Draft"].ToString() ?? "";
                                var final = reader["Final"].ToString() ?? "";
                                var invoiceFinalizedDate = Convert.ToDateTime(reader["FinalizedDate"].ToString()).ToString("yyyy-MM-dd") ?? "";
                                var customer = reader["Customer"].ToString() ?? "";
                                var currency = reader["Currency"].ToString() ?? "";

                                var invoiceGkeyConvertedToLong = Convert.ToInt32(invoiceGkey);
                                var draftConvertedToLong = Convert.ToInt32(draft);

                                invoicesFinalizedList.Add(new(invoiceGkeyConvertedToLong, draftConvertedToLong, final, invoiceFinalizedDate, customer, currency));
                            }
                        }
                    }
                }
            }

            response.InvoiceType = invoiceType.Replace('_', ' ');
            response.InvoicesLength = invoicesFinalizedList.Count;
            response.Invoices = invoicesFinalizedList;
            return response;
        }

        public async Task<List<CTypeCSVPreviewDto>> GetCTypeCSVPreviewForInvoices(List<CTypeFinalInvoiceDto> cTypeFinalInvoiceDtoList)
        {

            List<CTypeCSVPreviewDto> result = [];
            for (int index = 0; index < cTypeFinalInvoiceDtoList.Count; index++)
            {
                List<CTypeInvoiceItemsDto> currentBatchOfInvoiceItems = await GetCTypeFinalizedInvoiceItemDetails(cTypeFinalInvoiceDtoList[index].InvoiceGkey);
                if (currentBatchOfInvoiceItems.Count <= 0)
                {
                    continue;
                }
                var unitFacilityVisitGkey = await GetUnitFacilityVisitGkey(cTypeFinalInvoiceDtoList[index].InvoiceGkey);
                var berth = await GetBerthForInvoice(Convert.ToInt64(unitFacilityVisitGkey));
                var profitCenter = berth switch
                {
                    "Berth 20" => "4000",
                    "Berth 27" => "5000",
                    _ => "5000",
                };

                var totalInvoiceAmountOfInvoiceItems = currentBatchOfInvoiceItems.Sum((row) => row.Total);
                var invoiceCustomer = cTypeFinalInvoiceDtoList[index].Customer;
                var invoiceFinalNumber = cTypeFinalInvoiceDtoList[index].Final;
                var invoiceFinalizedDate = cTypeFinalInvoiceDtoList[index].FinalizedDate;
                var invoiceCurrency = cTypeFinalInvoiceDtoList[index].Currency;
                var customerSapCode = await GetCustomerSapCode(invoiceCustomer);
                for (int invoiceItemsList = 0; invoiceItemsList < currentBatchOfInvoiceItems.Count; invoiceItemsList++)
                {

                    string currentContainerSize = await GetContainerSize(currentBatchOfInvoiceItems[invoiceItemsList].ContainerId);

                    var csvPreviewDtoResult = currentBatchOfInvoiceItems[invoiceItemsList].MapToCSVPreviewDto(
                            invoiceCustomer, profitCenter, invoiceFinalNumber, currentContainerSize, invoiceFinalizedDate, invoiceCurrency,
                            customerSapCode, totalInvoiceAmountOfInvoiceItems, berth);

                    result.Add(csvPreviewDtoResult);
                }
            }
            if (result.Count <= 0)
            {
                return null!;
            }
            return result;
        }
        private async Task<string> GetCustomerSapCode(string customerName)
        {
            var query = Container_SQL_Queries.GetCustomerSapCodeQuery();
            using (SqlConnection connection = new(_configuration.GetConnectionString("BGTPortalDBServerThirteenDatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@customerName", customerName);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var customerSapCode = reader["CustomerSapCode"].ToString() ?? "";
                                return customerSapCode;
                            }
                        }
                    }
                }
            }
            return "";
        }
        private async Task<string> GetContainerSize(string containerId)
        {
            string containerSizeResult = "";
            var query = Container_SQL_Queries.GetContainerSizeQuery();


            using (SqlConnection connection = new(_configuration.GetConnectionString("SparcsN4DatabaseConnection")))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@containerId", containerId);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (await reader.ReadAsync())
                        {
                            var containerSizeFromReader = reader["ContainerSize"];

                            if (containerSizeFromReader is not null)
                            {
                                containerSizeResult = containerSizeFromReader.ToString()!.Substring(3, 2);
                            }
                            else
                            {
                                containerSizeResult = "";
                            }
                            return containerSizeResult;
                        }
                    }
                }
            }
            return containerSizeResult;
        }

        public async Task<List<CTypeInvoiceItemsDto>> GetCTypeFinalizedInvoiceItemDetails(long invoiceGkey)
        {
            List<CTypeInvoiceItemsDto> result = [];

            var query = Container_SQL_Queries.GetCTypeFinalizedInvoiceItemDetails();
            using (SqlConnection connection = new(_configuration.GetConnectionString("BillingN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@invoiceGkey", invoiceGkey);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {


                            while (reader.Read())
                            {
                                var description = reader["Description"].ToString() ?? "";
                                var quantity = Convert.ToInt32(reader["Quantity"].ToString());
                                var total = Convert.ToDouble(reader["Total"].ToString());
                                var glCode = reader["GlCode"].ToString() ?? "";
                                var invoiceFinalNumber = reader["InvoiceFinalNumber"].ToString() ?? "";
                                var customerName = reader["CustomerName"].ToString() ?? "";
                                var invoiceCreatedDate = reader["InvoiceCreatedDate"].ToString() ?? "";
                                var invoiceFinalizedDate = reader["InvoiceFinalizedDate"].ToString() ?? "";
                                var containerId = reader["ContainerId"].ToString() ?? "";
                                var chargeableUnitEvent = reader["ChargeableUnitEvent"].ToString() ?? "";
                                var invoiceDraftNumber = reader["InvoiceDraftNumber"].ToString() ?? "";
                                var quantityBilled = Convert.ToDouble(reader["QuantityBilled"].ToString());
                                var newDtoToAdd = new CTypeInvoiceItemsDto(Guid.NewGuid().ToString(),
                                description,
                                quantity,
                                quantityBilled,
                                total,
                                glCode,
                                invoiceFinalNumber,
                                customerName,
                                Convert.ToDateTime(invoiceCreatedDate).ToString("yyyy-MM-dd") ?? string.Empty,
                                Convert.ToDateTime(invoiceFinalizedDate).ToString("yyyy-MM-dd") ?? string.Empty,
                                containerId,
                                chargeableUnitEvent,
                                invoiceDraftNumber
                                );
                                result.Add(newDtoToAdd);
                            }
                        }
                    }
                }
            }
            return result;
        }

        private async Task<string> GetUnitFacilityVisitGkey(long invoiceGkey)
        {
            var query = Container_SQL_Queries.GetInvoiceGkeyFromParmValues();

            using (SqlConnection connection = new(_configuration.GetConnectionString("BillingN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@invoiceGkey", invoiceGkey);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                var result = reader["Value"].ToString() ?? "";
                                return result;
                            }
                        }
                    }
                }
            }
            return "";
        }
        private async Task<string> GetBerthForInvoice(long unitFacilityVisitGkey)
        {
            var query = Container_SQL_Queries.GetInoviceBerth();
            using (SqlConnection connection = new(_configuration.GetConnectionString("SparcsN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                var berth = reader["Berth"].ToString() ?? "";
                                return berth;
                            }
                        }
                    }
                }
            }
            return "";
        }
        // Delete this in production.
        private string DetermineProfitCenterFromBerth(string berth)
        {
            const string BERTH20 = "Berth 20";
            const string BERTH27 = "Berth 27";
            if (berth.Equals(BERTH20))
            {
                return "4000";
            }
            else if (berth.Equals(BERTH27))
            {
                return "5000";
            }
            else
            {
                return "5000";
            }
        }
    }
}