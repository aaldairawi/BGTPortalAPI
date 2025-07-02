
using API.Dtos.Invoice;
using API.Helper;
using API.Services.Database;
using API.Services.Invoices.SearchInvoices;
using Microsoft.Data.SqlClient;

namespace API.Services.Invoices.ShippingLineInvoices;

public class ShippingLineFinalInvoicesRepository(IDatabase database, ISearchInvoices searchInvoices) : IShippingLineFinalInvoices
{
    private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));
    private readonly ISearchInvoices _searchInvoices = searchInvoices ?? throw new ArgumentNullException(nameof(searchInvoices));


    public async Task<List<FinalInvoiceDto>> GetShippingLineInvoicesByFinalizedDate(DateTime date)
    {

        var result = await _searchInvoices.GetShippingLineInvoicesByFinalizedDate(date);
        return result;
    }


    public async Task<SLParentAndPartnerInvoiceItemsDto?> GetSlInvoicePartnerItems(long invoiceGkey)
    {
        string query = SLInvoiceQueries.GetSLParentAndChildInvoiceItems();
        SqlParameter[] parameters = [new("@invoiceGkey", invoiceGkey)];

        return await _database.ExecuteReaderAsync<SLParentAndPartnerInvoiceItemsDto>(
            DatabaseConnectionConstants.BGTPortalN4DatabaseConnection,
            query,
            async reader =>
            {
                var result = new SLParentAndPartnerInvoiceItemsDto();
                int sourceTypeIndex = reader.GetOrdinal("SourceType");

                while (await reader.ReadAsync())
                {
                    var item = new SLInvoiceItemDto
                    {
                        Description = reader["Description"]?.ToString() ?? string.Empty,
                        Quantity = reader.GetDouble(reader.GetOrdinal("Quantity")),
                        Rate = reader.GetDouble(reader.GetOrdinal("Rate")),
                        ItemTotalAmount = reader.GetDouble(reader.GetOrdinal("ItemTotalAmount")),
                        InvoiceFinalNumber = reader["InvoiceFinalNumber"]?.ToString() ?? string.Empty,
                        Notes = reader["Notes"]?.ToString() ?? string.Empty,
                        Name = reader["Name"]?.ToString() ?? string.Empty,
                        FinalizedDate = reader.GetDateTime(reader.GetOrdinal("FinalizedDate")),
                        TariffId = reader["TariffId"]?.ToString() ?? string.Empty,
                        RateBilled = reader.GetDouble(reader.GetOrdinal("RateBilled")),
                        EventTypeId = reader["EventTypeId"]?.ToString() ?? string.Empty
                    };

                    var sourceType = reader["SourceType"]?.ToString() ?? "";
                    if (sourceType == "Parent")
                        result.ParentInvoiceItems.Add(item);
                    else if (sourceType == "Partner")
                        result.PartnerInvoiceItems.Add(item);
                }

                return result;
            },
            parameters

        );

    }

}