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
        public async Task<ActionResult<FinalInvoicesResponseDto>> GetFinalizedInvoicesByQueryParams([FromQuery] InvoiceParams invoiceParams)
        {
            WriteLine("Getting All Invoices");
            WriteLine(invoiceParams);
            
            var dateTimeConverted = Helper.DateHelper.FormatSafeDate(invoiceParams.FinalizedDate, true);
            if (string.IsNullOrEmpty(dateTimeConverted)) return BadRequest(new ProblemDetails { Title = "Please pass a proper date." });

            var result = await _finalInvoiceService.GetFinalizedInvoicesByQueryParams(invoiceParams.InvoiceType,
            invoiceParams.OrderBy, dateTimeConverted);

            return Ok(result);
        }

        [HttpGet("{invoiceFinalId}")]
        public async Task<ActionResult<FinalInvoicesResponseDto>> GetOneFinalizedInvoiceById(string invoiceFinalId)
        {
            var result = await _finalInvoiceService.GetOneFinalizedInvoiceById(invoiceFinalId);
            if (result == null) return NotFound(new ProblemDetails { Title = "Invoice not found" });
            return Ok(result);
        }
        
        [HttpGet("filters")]
        public async Task<ActionResult> GetAllInvoiceTypes()
        {
            var invoiceTypesByIdResult = await _finalInvoiceService.LoadAllInvoiceTypes();
            if (invoiceTypesByIdResult is null || invoiceTypesByIdResult.Count <= 0)
            {
                return BadRequest(new ProblemDetails { Title = "No invoice types were picked up." });
            }
            List<InvoiceTypeDto> invoiceOrderByHeaders = [new("Final"), new("Customer")];
            
            return Ok(new { invoiceTypesByIdResult, invoiceOrderByHeaders });
        }

    }
}