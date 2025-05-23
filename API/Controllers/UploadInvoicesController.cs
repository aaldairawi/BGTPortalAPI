using API.Dtos.Invoice;
using API.Services.Invoices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, DubaiFinance, IraqFinance")]
    public class UploadInvoicesController : BaseApiController
    {
        private readonly IUploadInvoices _uploadInovices;
        public UploadInvoicesController(IUploadInvoices uploadInvoices)
        {
            _uploadInovices = uploadInvoices ?? throw new ArgumentNullException(nameof(uploadInvoices));

        }


        [HttpPost]
        public async Task<ActionResult<bool>> PostAllInvoices(UploadInvoicesDto uploadInvoicesDto)
        {
            var result = await _uploadInovices.UploadInvoices(uploadInvoicesDto);

            if (!result)
            {
                return BadRequest(new ProblemDetails { Title = "A problem occured while uploading." });
            }
            return Ok(result);
        }


    }

}