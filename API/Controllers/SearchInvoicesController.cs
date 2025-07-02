using API.Dtos.Invoice;
using API.Services.Invoices.InvoiceHelper;
using API.Services.Invoices.SearchInvoices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin,Operations")]
    public class SearchInvoicesController(ISearchInvoices searchInvoices) : BaseApiController
    {

        private readonly ISearchInvoices _searchInvoices = searchInvoices ?? throw new ArgumentNullException(nameof(searchInvoices));

        [HttpGet("search-invoice")]
        public async Task<ActionResult<FinalInvoiceDto>> GetOneFinalizedInvoiceById([FromQuery] string invoiceFinalId)
        {

            WriteLine("Searching invoice final number" + invoiceFinalId);

            var result = await _searchInvoices.SearchFinalizedInvoiceById(invoiceFinalId);
            if (result == null)
                return NotFound(new ProblemDetails { Title = "Invoice not found" });

            return Ok(result);
        }



    }
}