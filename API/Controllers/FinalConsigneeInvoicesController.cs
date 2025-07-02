
namespace API.Controllers
{
    using API.Services.Invoices.ConsigneeInvoices;
    using API.Services.Invoices.SearchInvoices;
    using Dtos.Invoice;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using RequestHelpers;


    [Authorize(Roles = "Admin, DubaiFinance, IraqFinance")]

    public class FinalConsigneeInvoicesController(IConsigneeFinalInvoices finalInvoiceService, ISearchInvoices searchInvoices) : BaseApiController
    {
        private readonly IConsigneeFinalInvoices _finalInvoiceService = finalInvoiceService ?? throw new ArgumentNullException(nameof(finalInvoiceService));

        private readonly ISearchInvoices _searchInvoices = searchInvoices ?? throw new ArgumentNullException(nameof(finalInvoiceService));

        [HttpGet]
        public async Task<ActionResult<List<FinalInvoiceDto>>> GetFinalizedInvoicesByQueryParams([FromQuery] InvoiceParams invoiceParams)
        {

            var dateTimeConverted = Helper.DateHelper.FormatSafeDate(invoiceParams.FinalizedDate, true);
            if (string.IsNullOrEmpty(dateTimeConverted)) return BadRequest(new ProblemDetails { Title = "Please pass a proper date." });

            var result = await _searchInvoices.SearchConsigneeInvoicesByQueryParams(invoiceParams.InvoiceType, dateTimeConverted);

            return Ok(result);
        }
        [HttpGet("invoice-details")]
        public async Task<ActionResult<List<InvoiceItemDto>>> GetFinalizedInvoiceItems([FromQuery] string invoiceGkey)
        {
            if (!long.TryParse(invoiceGkey, out var gkey))
                return BadRequest(new ProblemDetails { Title = "Invalid invoice GKEY. Must be a numeric value." });

            var result = await _finalInvoiceService.GetConsigneeInvoiceItems(gkey);

            if (result == null || result.Count == 0)
                return NotFound("No invoice items found for the given invoice GKEY.");

            return Ok(result);
        }

    }


}