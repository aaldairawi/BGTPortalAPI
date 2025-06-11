

using API.Dtos.Stripping;
using API.Dtos.Stripping.Containers;
using API.Dtos.Stripping.StrippingDriver;
using API.Dtos.Stripping.StrippingLabor;
using API.Services.Stripping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin,Operations")]

    public class StrippingController : BaseApiController
    {

        private readonly IStripping _stripping;
        private readonly IStrippingHelper _strippingHelper;

        public StrippingController(IStripping stripping, IStrippingHelper strippingHelper)
        {
            _stripping = stripping ?? throw new ArgumentNullException(nameof(stripping));
            _strippingHelper = strippingHelper ?? throw new ArgumentNullException(nameof(strippingHelper));

        }

        [HttpPost("get-stripped-containers")]
        public async Task<ActionResult<List<StrippedContainerDto>>> GetAllStrippedContainers([FromBody] StrippedContainersDataRequest dataRequest)
        {
            await _stripping.ProcessRetiredContainersInDatabase(dataRequest);
            var result = await _stripping.GetStrippedContainersFromInAppDatabase(dataRequest);

            return Ok(result);
        }


        [HttpGet("get-stripping-drivers")]
        public async Task<ActionResult<List<StrippingDriverDto>>> GetAllDrivers()
        {
            WriteLine("Getting all drivers");

            var result = await _strippingHelper.GetAllStrippingDrivers();
            return Ok(result);
        }
        [HttpDelete("delete-stripping-driver/{driverId}")]
        public async Task<ActionResult> DeleteStrippingDriver(int driverId)
        {
            WriteLine("Deleting driver id " + driverId);


            var result = await _strippingHelper.DeleteStrippingDriver(driverId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPost("create-stripping-driver")]
        public async Task<ActionResult<StrippingDriverDto>> CreateStrippingDriver(CreateStrippingDriverDto createStrippingDriver)
        {
            var result = await _strippingHelper.CreateStrippingDriver(createStrippingDriver);
            WriteLine(result.ToString());

            if (result is null)
                return BadRequest("Failed to create stripping driver.");
            return Ok(result);
        }

        [HttpGet("get-stripping-labors")]
        public async Task<ActionResult<List<StrippingLaborTypeDto>>> GetStrippingLaborTypes()
        {
            var result = await _strippingHelper.GetAllStrippingLaborTypes();
            return Ok(result);

        }
        [HttpPost("create-stripping-labor")]
        public async Task<ActionResult<StrippingLaborTypeDto>> CreateStrippingLaborType([FromBody] CreateStrippingLaborTypeDto dto)
        {
            var result = await _strippingHelper.CreateStrippingLabor(dto);
            if (result is null)
            {
                return BadRequest(new ProblemDetails { Title = "Problem creating a new labor." });
            }
            return Ok(result);
        }

        [HttpDelete("delete-labor-type/{laborTypeId}")]
        public async Task<ActionResult> DeleteStrippingLaborType(int laborTypeId)
        {
            var result = await _strippingHelper.DeleteStrippingLabor(laborTypeId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();

        }
        [HttpPost("update-retired-containers")]
        public async Task<ActionResult<UpdateRetiredContainersResult>> UpdateRetiredContainers([FromBody] UpdateRetiredContainers dto)
        {
            bool result = await _stripping.PatchStripContainerInDB(dto);
            if (!result)
            {
                return BadRequest(new ProblemDetails { Title = "An error occured while updating containers" });

            }

            // var response = new UpdateRetiredContainersResult(
            //     Success: result,
            //     UpdatedCount: result ? dto.Containers.Count : 0,
            //     FailedContainers: result ? [] : [.. dto.Containers.Select(c => c)]
            // );
            WriteLine(result);
            return Ok(result);
        }
    }
}
