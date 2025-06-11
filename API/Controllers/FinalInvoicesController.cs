
using API.Dtos.Invoice;
using API.RequestHelpers;
using API.Services.Invoices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, DubaiFinance, IraqFinance")]

    public class FinalInvoicesController : BaseApiController
    {
        private readonly IFinalInvoice _finalInvoiceService;


        public FinalInvoicesController(IFinalInvoice finalInvoiceService)
        {
            _finalInvoiceService = finalInvoiceService ?? throw new ArgumentNullException(nameof(finalInvoiceService));
        }


        [HttpGet]
        public async Task<ActionResult<List<FinalInvoiceDto>>> GetFinalizedInvoicesByQueryParams([FromQuery] InvoiceParams invoiceParams)
        {

            var dateTimeConverted = Helper.DateHelper.FormatSafeDate(invoiceParams.FinalizedDate, true);
            if (string.IsNullOrEmpty(dateTimeConverted)) return BadRequest(new ProblemDetails { Title = "Please pass a proper date." });

            var result = await _finalInvoiceService.GetFinalizedInvoicesByQueryParams(invoiceParams.InvoiceType, dateTimeConverted);

            return Ok(result);
        }
        [HttpGet("invoice-details")]
        public async Task<ActionResult<List<InvoiceItemDto>>> GetFinalizedInvoiceItems([FromQuery] string invoiceGkey)
        {
            var result = await _finalInvoiceService.GetFinalizedInvoiceItems(invoiceGkey);

            if (result == null || result.Count == 0)
            {
                return BadRequest("Error fetching invoice items for invoice.");
            }

            return Ok(result);
        }
        [HttpGet("invoice-details-s-type")]
        public async Task<ActionResult<List<SLInvoiceItemDto>>> GetSLFinalizedInvoiceItems([FromQuery] long invoiceGkey)
        {
            WriteLine("Items for s type requested" + invoiceGkey);
            var result = await _finalInvoiceService.GetSLTypeInvoiceItems(invoiceGkey);
            if (result == null || result.Count == 0)
            {
                return BadRequest("Error fetching invoice items for invoice.");
            }
            return Ok(result);
        }

        [HttpGet("single-invoice")]
        public async Task<ActionResult<FinalInvoiceDto>> GetOneFinalizedInvoiceById([FromQuery] string invoiceFinalId)
        {

            var result = await _finalInvoiceService.GetOneFinalizedInvoiceById(invoiceFinalId);

            if (result == null)
                return NotFound(new ProblemDetails { Title = "Invoice not found" });

            return Ok(result);
        }


        [HttpGet("filters-ctype")]
        public async Task<ActionResult> GetAllCTypeInvoiceFilters()
        {
            var invoiceTypesByIdResult = await _finalInvoiceService.LoadAllCTypeInvoices();
            if (invoiceTypesByIdResult is null || invoiceTypesByIdResult.Count <= 0)
            {
                return BadRequest(new ProblemDetails { Title = "No invoice types were picked up." });
            }
            List<InvoiceTypeDto> invoiceOrderByHeaders = [new("Final"), new("Customer")];

            return Ok(new { invoiceTypesByIdResult, invoiceOrderByHeaders });
        }


        [HttpGet("filters-stype")]
        public async Task<ActionResult> GetAllSTypeInvoiceFilters()
        {
            var invoiceTypesByIdResult = await _finalInvoiceService.LoadAllSTypeInvoices();
            if (invoiceTypesByIdResult is null || invoiceTypesByIdResult.Count <= 0)
            {
                return BadRequest(new ProblemDetails { Title = "No invoice types were picked up." });
            }
            List<InvoiceTypeDto> invoiceOrderByHeaders = [new("Final"), new("Customer")];

            return Ok(new { invoiceTypesByIdResult, invoiceOrderByHeaders });
        }


    }
}