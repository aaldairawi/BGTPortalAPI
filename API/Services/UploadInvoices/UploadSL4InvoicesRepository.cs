using System.Text;
using API.Data;
using API.Dtos.InvoiceUpload;
using API.Entities;
using API.Services.CSVBuilder;
using API.Services.HTTPHelper;
using API.Services.Invoices.InvoiceHelper;
using API.Services.InvoiceUploadGuard;

namespace API.Services.UploadInvoices
{
    public class UploadSL4InvoicesRepository(
        IUploadInvoicesHelper uploadHelper,
        ICsvBuilderService csvBuilder,
        IInvoiceHelper invoiceHelper,
        IHttpHelper httpHelper,
IInvoiceUploadGuard invoiceUploadGuard,

        BGTContext context) : IUploadSL4Invoices

    {

        private readonly IUploadInvoicesHelper _uploadHelper = uploadHelper ?? throw new ArgumentNullException(nameof(uploadHelper));
        private readonly ICsvBuilderService _csvBuilder = csvBuilder ?? throw new ArgumentNullException(nameof(csvBuilder));
        private readonly IInvoiceHelper _invoiceHelper = invoiceHelper ?? throw new ArgumentNullException(nameof(invoiceHelper));
        private readonly IHttpHelper _httpHelper = httpHelper ??
        throw new ArgumentNullException(nameof(httpHelper));
        private readonly BGTContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IInvoiceUploadGuard _invoiceUploadGuard = invoiceUploadGuard ?? throw new ArgumentNullException(nameof(invoiceUploadGuard));


        public async Task<bool> UploadSL4ToPreviewCSV(UploadSl4InvoiceDto dto)
        {
            if (await _invoiceUploadGuard.HasAlreadyBeenUploadedAsync(dto.PartnerInvoiceNumber))
                throw new InvalidOperationException("Invoice has already been uploaded.");



            const string testFolderPath = @"\\10.100.0.87\TestPortal_Sap integration";
            var result = await GenerateAndUploadSl4InvoiceCsv(dto.ParentInvoiceNumber,
            dto.PartnerInvoiceNumber,
             dto.InvoiceType,
            dto.Berth,
            testFolderPath);
            return result;

        }

        public async Task<bool> UploadSL4ToProduction(UploadSl4InvoiceDto dto)
        {
            try
            {

                await Task.Delay(200); // simulate work
                return true;
            }
            catch (Exception ex)
            {
                WriteLine(ex.Message);

                return false;
            }
        }


        private async Task<bool> GenerateAndUploadSl4InvoiceCsv(
            string parentInvoiceNumber,
     string partnerInvoiceNumber,
     string invoiceType,
     string berth,
     string destinationFolder)
        {
            try
            {

                var sb = new StringBuilder();
                var timestamp = DateTime.Now.ToString("ddMMyyyyHHmm");

                // 1. Get Meta
                var meta = await
                _uploadHelper.GetShippingLineInvoiceSL4BillingMetaDataDto(partnerInvoiceNumber,
                berth);
                if (meta == null)
                {
                    WriteLine("Invoice metadata not found.");
                    return false;
                }

                await _uploadHelper.EnrichShippingLineSL4BillingMetaDto(meta);
                WriteLine($"Enriched billing meta for {invoiceType} invoice");
                List<InvoiceHeader> invoiceHeaders = [];

                int currentUserId = _httpHelper.GetCurrentUserId();


                // 2. Header Line
                var header = new CsvHeaderLineSL4Dto(
                    meta.InvoiceFinalNumber,
                    meta.InvoiceFinalizedDate,
                    meta.CustomerSapCode ?? "UNKNOWN",
                    meta.TotalAmount.ToString("F2"),
                    meta.ProfitCenter ?? "UNKNOWN",
                    "USD",
                    meta.InvoiceNotes
                );

                sb.AppendLine(_csvBuilder.BuildCsvHeaderSL4(header));
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

                // 3. Invoice Lines


                var items = await
                 _invoiceHelper.GetSL4InvoiceLineItemsCsv(parentInvoiceNumber, partnerInvoiceNumber);

                WriteLine("Items done with " + items.Count);

                foreach (var item in items)
                {
                    if (item is null) continue;
                    WriteLine(item.FinalNumber);

                    // Main Line    
                    var line = _csvBuilder.BuildSl4ShippingLineCsvLine(item);
                    sb.AppendLine(line);
                }
                WriteLine("Done with loop");


                // 4. File Path
                var fileName = $"{invoiceType}_Link_Inv_{timestamp}.csv";
                var path = Path.Combine(destinationFolder, fileName);
                await File.WriteAllTextAsync(path, sb.ToString());

                WriteLine($"CSV successfully written to: {path}");
                _context.InvoiceHeaders.AddRange(invoiceHeaders);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                WriteLine($"CSV generation failed: {ex.Message}");
                return false;
            }
        }



    }
}
