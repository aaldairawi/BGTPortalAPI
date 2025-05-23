using System.Text.RegularExpressions;
using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;
using API.Helper;

namespace API.Services.Invoices
{
    public class UploadInvoicesRepository : IUploadInvoices
    {
        private readonly IDatabase _database;
        private readonly IInvoiceHelper _invoiceHelper;

        public UploadInvoicesRepository(IDatabase database, IInvoiceHelper invoiceHelper)
        {
            _database = database ?? throw new ArgumentNullException(nameof(database));
            _invoiceHelper = invoiceHelper ?? throw new ArgumentNullException(nameof(invoiceHelper));
        }

        public async Task<bool> UploadInvoices(UploadInvoicesDto dto)
        {
            if (dto.UploadToProduction)
            {
                return await UploadInvoicesSapProductionFolder(dto);
            }
            else
            {
                return await UploadInvoicesSapTestFolder(dto);
            }
        }

        public async Task<bool> UploadInvoicesSapTestFolder(UploadInvoicesDto dto)
        {
            string testFolderPath = @"\\10.100.0.87\TestPortal_Sap integration";
            return await GenerateAndUploadCsv(dto.Invoices, dto.InvoiceType, testFolderPath);
        }

        public async Task<bool> UploadInvoicesSapProductionFolder(UploadInvoicesDto dto)
        {
            string testFolderPath = @"\\10.100.0.87\TestPortal_Sap integration";
            return await GenerateAndUploadCsv(dto.Invoices, dto.InvoiceType
            , testFolderPath);
        }

        private async Task<bool> GenerateAndUploadCsv(List<string> invoiceIds, string invoiceType, string destinationFolder)
        {
            try
            {
                var csvLines = new List<string>();
                int fileCounter = 1;
                int rowLimit = 999;
                int currentRowCount = 0;
                var timestamp = DateTime.Now.ToString("ddMMyyyyHHmm");

                // Step 1: Get metadata
                var metadataList = await _invoiceHelper.GetInvoiceMetaData(invoiceIds);

                // Step 2: Preload all invoice items and containerIds
                var allInvoiceItems = new Dictionary<string, List<InvoiceItemDto>>();
                var containerIdSet = new HashSet<string>();

                foreach (var meta in metadataList)
                {
                    var invoiceGkey = await _invoiceHelper.GetInvoiceGkeyFromBillingInvoices(meta.InvoiceFinalNumber);
                    var items = await _invoiceHelper.GetInvoiceItems(invoiceGkey);
                    allInvoiceItems[meta.InvoiceFinalNumber] = items;

                    foreach (var item in items)
                    {
                        if (!string.IsNullOrWhiteSpace(item.ContainerId))
                            containerIdSet.Add(item.ContainerId);
                    }
                }

                // Step 3: Batch fetch all container sizes
                var containerSizes = await _invoiceHelper.GetContainerSize(containerIdSet);

                // Step 4: Generate CSV lines
                foreach (var meta in metadataList)
                {
                    var headerDto = new CsvHeaderLineDto(
                        meta.InvoiceFinalNumber,
                        meta.InvoiceFinalizedDate,
                        meta.CustomerSapCode,
                        meta.TotalAmount,
                        meta.CustomerName,
                        meta.ProfitCenter,
                        meta.InvoiceCurrency,
                        meta.InvoiceNotes
                    );

                    var hdrLine = BuildCsvHdrLine(headerDto);
                    csvLines.Add(hdrLine);
                    currentRowCount++;

                    if (allInvoiceItems.TryGetValue(meta.InvoiceFinalNumber, out var items))
                    {
                        foreach (var item in items)
                        {
                            if (item.ItemTotalAmount == "0") continue;

                            // Lookup container length
                            containerSizes.TryGetValue(item.ContainerId, out var containerLength);
                            var containerSizeResult = ExtractContainerSize(containerLength!);


                            var lin = BuildCsvLine(item, meta.InvoiceFinalNumber, containerSizeResult);
                            csvLines.Add(lin);
                            currentRowCount++;
                        }
                    }

                    // Handle file chunking if row limit is reached
                    if (currentRowCount >= rowLimit)
                    {
                        WriteLine(currentRowCount);
                        var filename = $"{invoiceType}_Inv_{timestamp}_{fileCounter}.csv";
                        var fullPath = Path.Combine(destinationFolder, filename);
                        await File.WriteAllLinesAsync(fullPath, csvLines);

                        csvLines.Clear();
                        currentRowCount = 0;
                        fileCounter++;
                    }
                }

                // Write remaining lines
                if (csvLines.Count > 0)
                {
                    var filename = $"{invoiceType}_Inv_{timestamp}_{fileCounter}.csv";
                    var fullPath = Path.Combine(destinationFolder, filename);
                    await File.WriteAllLinesAsync(fullPath, csvLines);
                }
                return true;
            }
            catch (Exception ex)
            {
                WriteLine("CSV generation failed: " + ex);
                return false;
            }
        }

        private static string ExtractContainerSize(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;
            var match = Regex.Match(input, @"NOM(\d+)");
            return match.Success ? match.Groups[1].Value : string.Empty;
        }
        private static string BuildCsvLine(InvoiceItemDto invoiceItem, string invoiceFinalNumber, string containerLength)
        {
            var reference = $"{invoiceFinalNumber}-{containerLength}-{invoiceItem.Quantity}";
            const string LIN = "LIN";

            WriteLine($"Invoice item amount {invoiceItem.ItemTotalAmount}");

            var lin = string.Join(",",
                    LIN,
                    invoiceFinalNumber,
                    "",
                    invoiceItem.GLCode,
                    $"{invoiceItem.ContainerId}-{invoiceItem.EventTypeId}",
                    reference,
                    "",
                    invoiceItem.ItemTotalAmount,
                    "",
                    "",
                    "",
                    reference);
            return lin;
        }

        private static string BuildCsvHdrLine(CsvHeaderLineDto csvHeader)
        {
            var invoiceFinalizedDate = DateHelper.FormatSafeDate(csvHeader.InvoiceFinalizedDate, false);
            const string headerText = "HDR";
            const string invoiceText = "INVOICE";

            var invoiceTotalAmount = csvHeader.InvoiceTotalAmount;
            var hdr = string.Join(",",
                headerText,
                csvHeader.InvoiceFinalNumber,
                invoiceFinalizedDate,
                csvHeader.InvoiceCurrency,
                invoiceFinalizedDate,
                csvHeader.InvoiceNotes,
                csvHeader.CustomerSapCode,
                "",
                invoiceTotalAmount,
                "",
                invoiceTotalAmount,
                invoiceText,
                "",
                "",
                "",
                csvHeader.ProfitCenter);
            return hdr;
        }

    }
}
