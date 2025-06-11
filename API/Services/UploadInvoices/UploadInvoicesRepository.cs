
using System.Text;
using System.Text.RegularExpressions;
using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;

namespace API.Services.Invoices
{
    public partial class UploadInvoicesRepository : IUploadInvoices
    {
        private readonly IDatabase _database;
        private readonly IInvoiceHelper _invoiceHelper;
        private readonly IUploadInvoicesHelper _iuploadInvoiceHelper;
        private readonly ICsvBuilderService _csvBuilderService;

        public UploadInvoicesRepository(IDatabase database, IInvoiceHelper invoiceHelper, IUploadInvoicesHelper iuploadInvoicesHelper, ICsvBuilderService csvBuilderService)
        {
            _database = database ?? throw new ArgumentNullException(nameof(database));
            _invoiceHelper = invoiceHelper ?? throw new ArgumentNullException(nameof(invoiceHelper));
            _iuploadInvoiceHelper = iuploadInvoicesHelper ?? throw new ArgumentNullException(nameof(iuploadInvoicesHelper));
            _csvBuilderService = csvBuilderService ?? throw new ArgumentNullException(nameof(csvBuilderService));

        }

        public async Task<bool> UploadToPreviewCSV(UploadInvoicesDto dto)
        {
            const string testFolderPath = @"\\10.100.0.87\TestPortal_Sap integration";


            var result = await GenerateAndUploadCsv(dto.Invoices, dto.InvoiceType, testFolderPath);
            return result;
        }

        public async Task<bool> UploadToSapProduction(UploadInvoicesDto dto)
        {
            string testFolderPath = @"\\10.100.0.87\TestPortal_Sap integration";
            return await GenerateAndUploadCsv(dto.Invoices, dto.InvoiceType, testFolderPath);
        }



        public async Task<bool> GenerateAndUploadCsv(List<string> invoiceIds, string invoiceType,
        string destinationFolder)
        {
            try
            {
                var sb = new StringBuilder();

                int fileCounter = 1;
                int rowLimit = 999;
                int currentRowCount = 0;
                var timestamp = DateTime.Now.ToString("ddMMyyyyHHmm");

                List<InvoiceBillingMetaDataDto> billingMetaDataDtos = await _iuploadInvoiceHelper.GetInvoiceBillingMetaDataWithTempTableAsync(invoiceIds);

                await _iuploadInvoiceHelper.EnrichBillingMetaDto(billingMetaDataDtos);
                WriteLine("Done Enriching Dtos");

                var allInvoiceItems = new Dictionary<string, List<InvoiceItemDto>>();

                var containerIdSet = new HashSet<string>();
                var itemTasks = billingMetaDataDtos.Select(async meta =>
                {
                    var invoiceGkey = await _invoiceHelper.GetInvoiceGkeyFromBillingInvoices(meta.InvoiceFinalNumber);

                    var items = await _invoiceHelper.GetInvoiceItems(invoiceGkey);

                    return (meta.InvoiceFinalNumber, items);
                });
                var results = await Task.WhenAll(itemTasks);
                WriteLine("Done with item Tasks");

                foreach (var (finalNumber, items) in results)
                {
                    allInvoiceItems[finalNumber] = items;
                    foreach (var item in items)
                    {
                        if (!string.IsNullOrWhiteSpace(item.ContainerId))
                            containerIdSet.Add(item.ContainerId);
                    }
                }
                var containerSizes = await _invoiceHelper.GetContainerSize(containerIdSet);

                WriteLine("Done with container Sizes");
                var containerSizeMap = containerSizes.ToDictionary(kvp => kvp.Key, kvp => ExtractContainerSize(kvp.Value));

                foreach (var meta in billingMetaDataDtos)
                {
                    var headerDto = new CsvHeaderLineDto(
                        meta.InvoiceFinalNumber,
                        meta.InvoiceFinalizedDate,
                        meta.CustomerSapCode ?? "",
                        meta.TotalAmount.ToString("F2"),
                        meta.CustomerName,
                        meta.ProfitCenter ?? "",
                        meta.InvoiceCurrency,
                        meta.InvoiceNotes
                    );
                    
                    sb.AppendLine(_csvBuilderService.BuildCsvHeader(headerDto));
                    


                    currentRowCount++;

                    if (allInvoiceItems.TryGetValue(meta.InvoiceFinalNumber, out var items))
                    {
                        foreach (var item in items)
                        {

                            var containerSize = containerSizeMap.TryGetValue(item.ContainerId, out var result) ? result : string.Empty;
                            sb.AppendLine(_csvBuilderService.BuildCsvLine(item, meta.InvoiceFinalNumber, containerSize));

                            currentRowCount++;
                            if (currentRowCount >= rowLimit)
                            {

                                var filename = $"{invoiceType}_Inv_{timestamp}_{fileCounter}.csv";
                                var fullPath = Path.Combine(destinationFolder, filename);
                                await using (var writer = new StreamWriter(fullPath, false, Encoding.UTF8))
                                {
                                    await writer.WriteAsync(sb.ToString());
                                }
                                sb.Clear();

                                currentRowCount = 0;
                                fileCounter++;
                            }

                        }
                    }

                }


                if (sb.Length > 0)
                {
                    var filename = $"{invoiceType}_Inv_{timestamp}_{fileCounter}.csv";
                    var fullPath = Path.Combine(destinationFolder, filename);
                    await using (var writer = new StreamWriter(fullPath, false, Encoding.UTF8))
                    {
                        await writer.WriteAsync(sb.ToString());
                    }
                    WriteLine("Wrote to csv file done");
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
            var match = MyRegex().Match(input);
            return match.Success ? match.Groups[1].Value : string.Empty;
        }

        [GeneratedRegex(@"NOM(\d+)")]
        private static partial Regex MyRegex();
    }
}
