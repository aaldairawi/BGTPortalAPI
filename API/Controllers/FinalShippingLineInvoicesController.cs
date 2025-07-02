using API.Dtos.Invoice;
using API.Services.Invoices.SearchInvoices;
using API.Services.Invoices.ShippingLineInvoices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, DubaiFinance")]

    public class FinalShippingLineInvoicesController(IShippingLineFinalInvoices shippingLine,
    ISearchInvoices searchInvoices) : BaseApiController
    {
        private readonly IShippingLineFinalInvoices _shippingLineInvoices = shippingLine ?? throw new ArgumentNullException(nameof(shippingLine));
        private readonly ISearchInvoices _searchInvoices = searchInvoices ?? throw new ArgumentNullException(nameof(searchInvoices));

        [HttpGet("shippingline")]
        public async Task<ActionResult<List<FinalInvoiceDto>>> GetShippingLineInvoicesByFinalizedDate(
            [FromQuery] string finalizedDate)
        {
            if (!DateTime.TryParse(finalizedDate, out var dateResult))
                return BadRequest(new ProblemDetails { Title = "Please pass a valid date in yyyy-MM-dd format." });

            var result = await _searchInvoices.GetShippingLineInvoicesByFinalizedDate(dateResult);

            if (result == null || result.Count == 0)
                return NoContent();
            return Ok(result);
        }


        [HttpGet("shipping-line-parent-partner-invoice-details")]
        public async Task<ActionResult<SLParentAndPartnerInvoiceItemsDto>> GetSLInvoiceParentAndPartnerItems([FromQuery] long invoiceGkey)
        {
            
            var result = await _shippingLineInvoices.GetSlInvoicePartnerItems(invoiceGkey);
            
            if (result == null ||
                (result.ParentInvoiceItems.Count == 0 && result.PartnerInvoiceItems.Count == 0))
            {
                return NotFound("No parent or partner invoice items found for the given invoice.");
            }

            return Ok(result);
        }






    }
}