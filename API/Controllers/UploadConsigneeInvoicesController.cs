using API.Dtos.InvoiceUpload;
using API.Services.UploadInvoices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, DubaiFinance, IraqFinance")]
    public class UploadConsigneeInvoicesController(IUploadConsigneeInvoices uploadInvoices) : BaseApiController
    {
        private readonly IUploadConsigneeInvoices _uploadInovices = uploadInvoices ?? throw new ArgumentNullException(nameof(uploadInvoices));

        [HttpPost("previewcsv")]
        public async Task<ActionResult<bool>> PreviewConsigneeInvoicesCSV([FromBody] UploadInvoicesDto uploadInvoicesDto)
        {
            WriteLine(uploadInvoicesDto.InvoiceType);
            
            var result = await _uploadInovices.UploadToPreviewCSV(uploadInvoicesDto);

            if (!result)
            {
                return BadRequest(new ProblemDetails { Title = "A problem occured while uploading." });
            }
            return Ok(result);
        }



        [HttpPost("uploadtosap")]
        public async Task<ActionResult<bool>> UploadToSapConsigneeInvoices([FromBody] UploadInvoicesDto uploadInvoicesDto)
        {
            WriteLine(uploadInvoicesDto.InvoiceType);

            var result = await _uploadInovices.UploadToPreviewCSV(uploadInvoicesDto);

            if (!result)
            {
                return BadRequest(new ProblemDetails { Title = "A problem occured while uploading." });
            }
            return Ok(result);
        }





    }

}