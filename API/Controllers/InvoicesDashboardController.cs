
using API.Dtos.InvoiceDashboard;
using API.Services.InvoiceDashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, DubaiFinance")]

    public class InvoicesDashboardController(IInvoiceDashboard invoiceDashboard) : BaseApiController
    {

        private readonly IInvoiceDashboard _invoiceDashboard = invoiceDashboard ?? throw new
        ArgumentNullException(nameof(invoiceDashboard));



        [HttpGet("get-uploaded-invoices")]
        public async Task<ActionResult<List<InvoiceHeaderDto>>> GetAllUploadedInvoices(
            [FromQuery] DateOnly uploadedDate)
        {

            var result = await _invoiceDashboard.GetAllUploadedInvoices(uploadedDate);
            

            return Ok(result);

        }

        [HttpGet("get-pending-invoices")]

        public async Task<ActionResult<List<InvoicePendingUploadDto>>> GetAllPendingInvoices(
            [FromQuery] DateOnly finalizedDate)
        {
            var invoiceNumbers = await _invoiceDashboard.GetAllPendingInvoiceNumbers(finalizedDate);

            var result = await _invoiceDashboard.ReportAllPendingInvoices(invoiceNumbers, finalizedDate);
            if (result.Count == 0)
                return NoContent();
            return Ok(result);


        }



    }
}