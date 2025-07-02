
using API.Dtos.Invoice;
using API.Services.Invoices.ConsigneeInvoices;
using API.Services.Invoices.ShippingLineInvoices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, DubaiFinance, IraqFinance")]
    public class InvoiceFiltersController(IConsigneeFinalInvoices consigneeInvoices) : BaseApiController
    {



        private readonly IConsigneeFinalInvoices _consigneeInvoices = consigneeInvoices ?? throw new ArgumentNullException(nameof(consigneeInvoices));

        [HttpGet("filters-ctype")]
        public async Task<ActionResult> GetAllCTypeInvoiceFilters()
        {
            var invoiceTypesByIdResult = await _consigneeInvoices.LoadAllCTypeInvoices();
            if (invoiceTypesByIdResult is null || invoiceTypesByIdResult.Count <= 0)
            {
                return BadRequest(new ProblemDetails { Title = "No invoice types were picked up." });
            }
            List<InvoiceTypeDto> invoiceOrderByHeaders = [new("Final"), new("Customer")];

            return Ok(new { invoiceTypesByIdResult, invoiceOrderByHeaders });
        }



    }
}