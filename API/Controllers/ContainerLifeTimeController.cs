using API.Dtos.Container;
using API.Dtos.Container.Export;
using API.Dtos.Container.Import;
using API.Services.N4ContainerHistory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin,Operations")]


    public class ContainerLifeTimeController(IContainerCurrentStatus containerCurrentStatus, IContainerImportLifeTime containerImportLifeTimeContext,
            IContainerExportLifeTime containerExportLifeTime, IContainerLifeTimeMasterData containerLifeTimeMasterData) : BaseApiController
    {
        private readonly IContainerCurrentStatus _containerCurrentStatus = containerCurrentStatus ?? throw new ArgumentNullException(nameof(containerCurrentStatus));

        private readonly IContainerImportLifeTime _containerImportLifeTimeContext = containerImportLifeTimeContext ?? throw new ArgumentNullException(nameof(containerImportLifeTimeContext));
        private readonly IContainerExportLifeTime _containerExportLifeTimeContext = containerExportLifeTime ?? throw new ArgumentNullException(nameof(containerExportLifeTime));
        private readonly IContainerLifeTimeMasterData _containerLifeTimeMasterData = containerLifeTimeMasterData ?? throw new ArgumentNullException(nameof(containerLifeTimeMasterData));

        [HttpGet("unitcurrentstatus")]
        public async Task<ActionResult<ContainerCurrentStatusDto>> UnitCurrentStatus([FromQuery] string containerId)
        {
            WriteLine("Unit status requested");


            var result = await _containerCurrentStatus.GetContainerCurrentStatusResult(containerId);

            if (result == null)
                return NotFound(new ProblemDetails { Title = $"Unit {containerId} not found." });
            return Ok(result);
        }


        [HttpGet("unitlifetimeimport")]
        public async Task<ActionResult<ContainerImportResultDto>> UnitImportLifeTime(
            [FromQuery] string containerId)
        {
            WriteLine("Unit import life time requested");


            ContainerLifeTimeMasterDataDto? containerMasterData = await _containerLifeTimeMasterData.GetContainerLifeTimeMasterData(containerId, true);
            if (containerMasterData is null)
                return NotFound(new ProblemDetails { Title = $"No results for unit {containerId}" });


            var result = await _containerImportLifeTimeContext.GetContainerImportResult(containerMasterData);

            if (result == null) return NotFound(new ProblemDetails { Title = "Unit not found" });
            return Ok(result);
        }

        [HttpGet("unitlifetimeexport")]
        public async Task<ActionResult<ContainerExportResultDto>> UnitExportLifeTime(
            [FromQuery] string containerId)
        {
            WriteLine("Requested Unit life time export");

            ContainerLifeTimeMasterDataDto? containerMasterData = await _containerLifeTimeMasterData.GetContainerLifeTimeMasterData(
                containerId, false);
            if (containerMasterData is null)
            {

                return NotFound(new ProblemDetails { Title = $"No results for unit {containerId}" });
            }
            var result = await _containerExportLifeTimeContext.GetContainerExportResult(containerMasterData);
            if (result == null) return NotFound(new ProblemDetails { Title = $"Unit {containerId} not found." });
            return Ok(result);
        }


    }

}