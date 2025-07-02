using System.Globalization;
using System.Text;
using API.Dtos.Stripping.Containers;
using API.Dtos.Stripping.Dashboard;
using API.Services.Stripping;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
        [Authorize(Roles = "Admin,Operations")]


    public class StrippingDashboardController : BaseApiController
    {

        private readonly IStripping _stripping;
        private readonly CsvConfiguration _csvConfig;

        public StrippingDashboardController(IStripping stripping)
        {
            _stripping = stripping ?? throw new ArgumentNullException(nameof(stripping));
            _csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                NewLine = Environment.NewLine,
                ShouldQuote = _ => true
            };
        }


        [HttpGet("dashboard")]
        public async Task<ActionResult<List<StrippingDashboardDto>>> GetDashboardData(
            [FromQuery] string fromDate,
            [FromQuery] string toDate)
        {
            if (string.IsNullOrWhiteSpace(fromDate) || string.IsNullOrWhiteSpace(toDate))
            {
                return BadRequest("Both fromDate and toDate are required.");
            }

            if (!DateTime.TryParse(fromDate, out var from))
            {
                return BadRequest("Invalid fromDate format. Use yyyy-MM-dd.");
            }

            if (!DateTime.TryParse(toDate, out var to))
            {
                return BadRequest("Invalid toDate format. Use yyyy-MM-dd.");
            }

            // Normalize to include full end day up to 23:59:59
            to = to.Date.AddDays(1).AddTicks(-1);

            var result = await _stripping.GetDashboardDataRangeAsync(from, to);
            return Ok(result);
        }

        [HttpGet("dashboard/csv")]
        [EnableCors("Frontend")] // lets React read Content-Disposition
        public async Task<IActionResult> DownloadCsv(
            [FromQuery] DateOnly from,
            [FromQuery] DateOnly to,
            CancellationToken ct = default)
        {
            WriteLine("Dashboard csv hit");

            if (from > to)
                return BadRequest("'from' date must be ≤ 'to' date.");

            var data = await _stripping.GetCsvData(
                from.ToDateTime(TimeOnly.MinValue),
                to.ToDateTime(TimeOnly.MinValue),
                ct);

            if (data.Count == 0)
                return NotFound("No stripped-container data for the selected range.");

            var ms = new MemoryStream();
            await using var writer = new StreamWriter(ms, new UTF8Encoding(false), leaveOpen: true);
            await using var csv = new CsvWriter(writer, _csvConfig);

            csv.WriteHeader<StrippedContainerDto>();
            await csv.NextRecordAsync();
            csv.WriteRecords(data);

            await writer.FlushAsync(ct);
            ms.Position = 0;

            var fileName = $"stripped-containers-{from:yyyyMMdd}-{to:yyyyMMdd}.csv";

            Response.Headers.ContentDisposition =
                $"attachment; filename=\"{fileName}\"; filename*=UTF-8''{Uri.EscapeDataString(fileName)}";

            return File(ms, "text/csv");
        }



    }
}