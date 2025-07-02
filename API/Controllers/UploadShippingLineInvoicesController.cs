using API.Dtos.InvoiceUpload;
using API.Services.UploadInvoices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers;


[Authorize(Roles = "Admin, DubaiFinance")]
public class UploadShippingLineInvoicesController(IUploadSL2Invoices uploadSL2Invoices,
IUploadSL4Invoices uploadSL4Invoices) : BaseApiController
{
    private readonly IUploadSL2Invoices _uploadSL2Invoices = uploadSL2Invoices ?? throw new ArgumentNullException(nameof(uploadSL2Invoices));
    private readonly IUploadSL4Invoices _uploadSL4Invoices = uploadSL4Invoices ?? throw new ArgumentNullException(nameof(uploadSL4Invoices));

    [HttpPost("previewcsv/sl2")]
    public async Task<ActionResult<bool>> PreviewSL2CSV([FromBody] UploadShippingLineInvoicesDto dto)
    {
        WriteLine("Preview SL2 CSV controller hit" + dto.InvoiceNumber + dto.InvoiceType);

        var result = await _uploadSL2Invoices.UploadSL2ToPreviewCSV(dto);
        if (!result)
            return BadRequest(new ProblemDetails { Title = "SL2 preview CSV generation failed." });

        return Ok(result);
    }

    [HttpPost("uploadtosap/sl2")]
    public async Task<ActionResult<bool>> UploadSL2ToSap([FromBody] UploadShippingLineInvoicesDto dto)
    {
        var result = await _uploadSL2Invoices.UploadSL2ToProduction(dto);

        if (!result)
            return BadRequest(new ProblemDetails { Title = "SL2 production upload failed." });

        return Ok(result);
    }



    [HttpPost("previewcsv/sl4")]
    public async Task<ActionResult<bool>> PreviewSL4CSV([FromBody] UploadSl4InvoiceDto dto)
    {
        var result = await _uploadSL4Invoices.UploadSL4ToPreviewCSV(dto);

        if (!result)
            return BadRequest(new ProblemDetails { Title = "SL4 preview CSV generation failed." });

        return Ok(result);
    }


    [HttpPost("uploadtosap/sl4")]
    public async Task<ActionResult<bool>> UploadSL4ToSap([FromBody] UploadSl4InvoiceDto dto)
    {
        var result = await _uploadSL4Invoices.UploadSL4ToProduction(dto);

        if (!result)
            return BadRequest(new ProblemDetails { Title = "SL4 production upload failed." });

        return Ok(result);
    }
}
