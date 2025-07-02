
using API.Data;
using API.Dtos.InvoiceDashboard;
using API.Helper;
using API.Services.Database;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace API.Services.InvoiceDashboard
{
    public class InvoiceDashboardRepository(BGTContext context,
    IDatabase database) : IInvoiceDashboard
    {
        private readonly BGTContext _context = context ?? throw new ArgumentNullException(nameof(context));

        private readonly IDatabase _database = database ?? throw new ArgumentNullException(nameof(database));
        public async Task<HashSet<string>> GetAllPendingInvoiceNumbers(DateOnly finalizedDate)
        {
            var query = InvoiceDashboardQueries.GetAllCAndSlInvoicesCreatedOnFinalizedDate();
            var result = await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BillingN4Db,
                query,
                async reader =>
                {
                    var invoiceNumbers = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                    int finalNumberIndex = reader.GetOrdinal("FinalInvoiceNumber");

                    while (await reader.ReadAsync())
                    {
                        if (!reader.IsDBNull(finalNumberIndex))
                        {
                            string invoiceNumber = reader.GetString(finalNumberIndex);
                            if (!string.IsNullOrWhiteSpace(invoiceNumber))
                                invoiceNumbers.Add(invoiceNumber);
                        }
                    }

                    return invoiceNumbers;
                },
                new SqlParameter("@finalizedDate", finalizedDate.ToDateTime(TimeOnly.MinValue))
            );


            return result ?? new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        }


        public async Task<List<InvoicePendingUploadDto>> ReportAllPendingInvoices(
            HashSet<string> invoiceNumbers,
            DateOnly finalizedDate)
        {
            List<string> pendingInvoicesList = [];

            // Check the table for the missing invoice numbers.
            DateTime start = finalizedDate.ToDateTime(TimeOnly.MinValue);
            DateTime end = start.AddDays(1);

            // Gets all the uploaded invoices in db on the same finalized date.
            var uploadedInvoices =
            new HashSet<string>(
             await _context.InvoiceHeaders
            .AsNoTracking()
            .Where(i => i.FinalizedDate >= start && i.FinalizedDate < end)
            .Select(i => i.FinalInvoiceNumber)
            .ToListAsync(), StringComparer.OrdinalIgnoreCase);

            var pendingInvoices = invoiceNumbers.Where(invoice => !uploadedInvoices.Contains(invoice))
            .ToList();

            return await GetAllPendingInvoicesData(finalizedDate, pendingInvoices);


        }



        public async Task<List<InvoiceHeaderDto>> GetAllUploadedInvoices(DateOnly uploadedDate)
        {
            var result = await _context.InvoiceHeaders
                .Include(i => i.UploadedBy)
                .Where(invoice =>
                    DateOnly.FromDateTime(invoice.UploadedDate) == uploadedDate)
                .OrderBy(i => i.InvoiceType) // move it here
                .Select(i => new InvoiceHeaderDto
                {
                    Id = i.Id,
                    FinalInvoiceNumber = i.FinalInvoiceNumber,
                    FinalizedDate = i.FinalizedDate,
                    UploadedDate = i.UploadedDate,
                    UploadedByName = i.UploadedBy.UserName ?? "Unknown",
                    Currency = i.Currency,
                    InvoiceType = i.InvoiceType,
                    ProfitCenter = i.ProfitCenter,
                    InvoiceTotal = i.InvoiceTotal
                })
                .ToListAsync();

            return result;
        }


        private async Task<List<InvoicePendingUploadDto>> GetAllPendingInvoicesData(
    DateOnly finalizedDate,
    List<string> invoiceNumbers)
        {
            if (invoiceNumbers.Count == 0)
                return [];

            var (sql, sqlParams) =
                InvoiceDashboardQueries.BuildPendingInvoicesQueryWithInvoiceList(
                    finalizedDate, invoiceNumbers);

            return await _database.ExecuteReaderAsync(
                DatabaseConnectionConstants.BillingN4Db,
                sql,
                async reader =>
                {
                    var pending = new List<InvoicePendingUploadDto>();

                    int idxFinalNbr = reader.GetOrdinal("FinalInvoiceNumber");
                    int idxFinalDate = reader.GetOrdinal("FinalizedDate");
                    int idxCurrency = reader.GetOrdinal("Currency");
                    int idxInvType = reader.GetOrdinal("InvoiceType");
                    int idxCustomer = reader.GetOrdinal("Customer");
                    int idxInvTotal = reader.GetOrdinal("InvoiceTotal");

                    while (await reader.ReadAsync())
                    {
                        // Null checks (in case of LEFT JOINs, etc.)
                        string finalNbr = reader.IsDBNull(idxFinalNbr)
                                           ? string.Empty
                                           : reader.GetString(idxFinalNbr);

                        DateTime finDate = reader.IsDBNull(idxFinalDate)
                                           ? default
                                           : reader.GetDateTime(idxFinalDate);

                        string currency = reader.IsDBNull(idxCurrency)
                                           ? string.Empty
                                           : reader.GetString(idxCurrency);

                        string invType = reader.IsDBNull(idxInvType)
                                           ? string.Empty
                                           : reader.GetString(idxInvType);

                        string customer = reader.IsDBNull(idxCustomer)
                                           ? string.Empty
                                           : reader.GetString(idxCustomer);

                        double invTotal = reader.IsDBNull(idxInvTotal)
                                           ? 0
                                           : reader.GetDouble(idxInvTotal);

                        pending.Add(new InvoicePendingUploadDto
                        {
                            FinalInvoiceNumber = finalNbr,
                            FinalizedDate = finDate,
                            UploadedSuccessfully = false,   // still pending
                            Currency = currency,
                            InvoiceType = invType,
                            Customer = customer,
                            InvoiceTotal = invTotal
                        });
                    }

                    return pending;
                },
                sqlParams);
        }

    }
}