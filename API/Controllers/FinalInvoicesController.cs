
using System.ComponentModel.DataAnnotations;
using API.Dtos.CtypeInvoice;
using API.Dtos.Invoice;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, DubaiBilling")]
    public class FinalInvoicesController : BaseApiController
    {
        private readonly IFinalInvoice _finalInvoiceService;


        public FinalInvoicesController(IFinalInvoice finalInvoiceService)
        {
            _finalInvoiceService = finalInvoiceService ?? throw new ArgumentNullException(nameof(finalInvoiceService));
        }

        /// <summary>
        /// Gets all invoice ids/types from the database.
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <returns>A list of the requested invoice types based on the id.</returns>
        [HttpGet("getallinvoiceids")]
        public async Task<ActionResult<List<InvoiceTypeDto>>> GetAllCInvoiceTypes(string invoiceId)
        {
            var invoiceTypesByIdResult = await _finalInvoiceService.LoadAllInvoicesById(invoiceId);
            if (invoiceTypesByIdResult is null || invoiceTypesByIdResult.Count <= 0)
            {
                return BadRequest(new ProblemDetails { Title = "No invoice types were picked up." });
            }
            return Ok(invoiceTypesByIdResult);
        }


        [HttpGet("finalizedinvoices")]
        public async Task<ActionResult<List<FinalizedInvoiceItemsDto>>> GetFinalizedInvoicesByIdAndDate([StringLength(maximumLength: 3)] string invoiceType, 
        string finalizedDate)
        {

            bool isStringDateParseable = Helper.DateHelper.IsStringConvertableToDateTime(finalizedDate);

            if (!isStringDateParseable) return BadRequest(new ProblemDetails { Title = "Please pass a proper date." });
            DateTime finalizedDateToPass = Convert.ToDateTime(finalizedDate);

            var result = await _finalInvoiceService.GetFinalizedInvoicesByIdAndDate(invoiceType, finalizedDateToPass);
            if (result is null)
            {
                return BadRequest(new ProblemDetails { Title = "No results found for the given invoice type and date." });
            }
            return Ok(result);
        }
        [HttpGet("invoiceitems")]
        public async Task<ActionResult<List<FinalizedInvoiceItemsDto>>> GetInvoiceItemsByInvoiceGkey(int invoiceGkey)
        {

            var invoiceItemsDetails = await _finalInvoiceService.GetFinalizedInvoiceItemDetails(invoiceGkey);
            if (invoiceItemsDetails is null || invoiceItemsDetails.Count <= 0 ) return BadRequest(new ProblemDetails { Title = "The result of the invoice items is empty." });

            return Ok(invoiceItemsDetails);
        }

    }
}