using API.Dtos.CtypeInvoice;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, DubaiBilling")]
    public class CTypeInvoicesController : BaseApiController
    {
        private readonly ICInvoiceType _cInvoiceType;

        private readonly ICFinalInvoices _cFinalInvoices;
        public CTypeInvoicesController(ICInvoiceType cInvoiceType, ICFinalInvoices cFinalInvoices)
        {
            _cInvoiceType = cInvoiceType ?? throw new ArgumentNullException(nameof(cInvoiceType));

            _cFinalInvoices = cFinalInvoices ?? throw new ArgumentNullException(nameof(cFinalInvoices));

        }

        [HttpGet("getallcinvoicetypes")]
        public async Task<ActionResult<List<CTypeDto>>> GetAllCInvoiceTypes()
        {
            var invoiceTypes = await _cInvoiceType.GetAllCInvoiceTypes();
            if (invoiceTypes is null)
            {
                return BadRequest(new ProblemDetails { Title = "No invoice types were picked up." });
            }
            return Ok(invoiceTypes);
        }


        [HttpGet("finalizedinvoices")]
        public async Task<ActionResult<CTypeFinalInvoiceResponse>> GetAllFinalizedInvoices(string invoiceType, string finalizedDate) // Expects yyyy-mm-dd
        {

            bool isStringDateParseable = Helper.DateHelper.IsStringConvertableToDateTime(finalizedDate);
            if (!isStringDateParseable) return BadRequest(new ProblemDetails { Title = "Please pass a proper date." });
            DateTime finalizedDateToPass = Convert.ToDateTime(finalizedDate);
            var result = await _cFinalInvoices.GetAllCTypeFinalizedInvoices(invoiceType, finalizedDateToPass);

            return Ok(result);
        }
        [HttpGet("invoiceitems")]
        public async Task<ActionResult<List<CTypeInvoiceItemsDto>>> GetInvoiceItemsByInvoiceGkey(string invoiceGkey)
        {

            bool isInputConvertableToALong = long.TryParse(invoiceGkey, out long result);
            if (!isInputConvertableToALong)
            {
                return BadRequest(new ProblemDetails { Title = "The InvoiceGkey passed is not valid" });

            }
            var invoiceItemsDetails = await _cFinalInvoices.GetCTypeFinalizedInvoiceItemDetails(result);
            if (invoiceItemsDetails is null) return BadRequest(new ProblemDetails { Title = "The result of the invoice items is null." });

            if (invoiceItemsDetails.Count <= 0) return BadRequest(new ProblemDetails { Title = "The invoice has no items." });

            return Ok(invoiceItemsDetails);
        }
        [HttpPost("csvpreviewinvoices")]
        public async Task<ActionResult<List<CTypeCSVPreviewDto>>> GetCsvPreviewForInvoices(List<CTypeFinalInvoiceDto> invoicesDtos)
        {
            var result = await _cFinalInvoices.GetCTypeCSVPreviewForInvoices(invoicesDtos);
            if (result is null)
            {
                return BadRequest(new ProblemDetails { Title = "No results found for the given list of invoices." });
            }
            return Ok(result);
        }


    }
}