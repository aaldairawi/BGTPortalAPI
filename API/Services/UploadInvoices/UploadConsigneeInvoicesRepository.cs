
using System.Text;
using System.Text.RegularExpressions;
using API.Data;
using API.Dtos.Invoice;
using API.Dtos.InvoiceUpload;
using API.Entities;
using API.Services.CSVBuilder;
using API.Services.HTTPHelper;
using API.Services.Invoices.InvoiceHelper;
using API.Services.InvoiceUploadGuard;
using API.Services.UploadInvoices;

namespace API.Services.Invoices;

public partial class UploadConsigneeInvoicesRepository(IInvoiceHelper invoiceHelper,
IUploadInvoicesHelper iuploadInvoicesHelper,
ICsvBuilderService csvBuilderService,
IInvoiceGeneralInfo invoiceGeneralInfo,
IHttpHelper httpHelper,
IInvoiceUploadGuard invoiceUploadGuard,
BGTContext context) : IUploadConsigneeInvoices
{

    private readonly IInvoiceHelper _invoiceHelper = invoiceHelper ?? throw new ArgumentNullException(nameof(invoiceHelper));
    private readonly IUploadInvoicesHelper _iuploadInvoiceHelper = iuploadInvoicesHelper ?? throw new ArgumentNullException(nameof(iuploadInvoicesHelper));
    private readonly ICsvBuilderService _csvBuilderService = csvBuilderService ?? throw new ArgumentNullException(nameof(csvBuilderService));
    private readonly IInvoiceGeneralInfo _invoiceGeneralInfo = invoiceGeneralInfo ?? throw new ArgumentNullException(nameof(invoiceGeneralInfo));
    private readonly IHttpHelper _httpHelper = httpHelper ?? throw new ArgumentNullException(nameof(httpHelper));
    private readonly BGTContext _context = context ?? throw new ArgumentNullException(nameof(context));
    private readonly IInvoiceUploadGuard _invoiceUploadGuard = invoiceUploadGuard ?? throw new ArgumentNullException(nameof(invoiceUploadGuard));


    public async Task<bool> UploadToPreviewCSV(UploadInvoicesDto dto)
    {

        if (await _invoiceUploadGuard.AnyAlreadyUploadedAsync(dto.Invoices))
            throw new InvalidOperationException("This batch has been already uploaded.");


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
                long invoiceGkey = await _invoiceGeneralInfo.GetInvoiceGkeyFromBillingInvoices(meta.InvoiceFinalNumber);

                List<InvoiceItemDto> items = await _invoiceHelper.GetConsigneeInvoiceItems(invoiceGkey);

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
            List<InvoiceHeader> invoiceHeaders = [];

            int currentUserId = _httpHelper.GetCurrentUserId();
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
                invoiceHeaders.Add(new InvoiceHeader
                {
                    FinalInvoiceNumber = meta.InvoiceFinalNumber,
                    FinalizedDate = meta.InvoiceFinalizedDate,
                    UploadedById = currentUserId,
                    UploadedDate = DateTime.UtcNow,
                    Currency = meta.InvoiceCurrency,
                    InvoiceType = invoiceType.Replace('_', ' '),
                    UploadedSuccessfully = true,
                    ProfitCenter = meta.ProfitCenter ?? "",
                    InvoiceTotal = meta.TotalAmount
                });


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
            _context.InvoiceHeaders.AddRange(invoiceHeaders);
            await _context.SaveChangesAsync();
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

