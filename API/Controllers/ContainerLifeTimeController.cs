using API.Dtos.Container;
using API.Dtos.Container.Export;
using API.Dtos.Container.Import;
using API.Services.N4ContainerHistory;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ContainerLifeTimeController : BaseApiController
    {
        private readonly IContainerCurrentStatus _containerCurrentStatus;
        private readonly IContainerGeneralRequests _containerGeneralRequests;
        private readonly IContainerImportLifeTime _containerImportLifeTimeContext;
        private readonly IContainerExportLifeTime _containerExportLifeTimeContext;
        public ContainerLifeTimeController(IContainerCurrentStatus currentContainerStatus, IContainerImportLifeTime containerImportLifeTimeContext,

         IContainerGeneralRequests containerGeneralRequestsContext, IContainerExportLifeTime containerExportLifeTime)
        {
            _containerCurrentStatus = currentContainerStatus ?? throw new ArgumentNullException(nameof(currentContainerStatus));
            _containerGeneralRequests = containerGeneralRequestsContext ?? throw new ArgumentNullException(nameof(containerGeneralRequestsContext));
            _containerImportLifeTimeContext = containerImportLifeTimeContext ?? throw new ArgumentNullException(nameof(containerImportLifeTimeContext));
            _containerExportLifeTimeContext = containerExportLifeTime ?? throw new ArgumentNullException(nameof(containerExportLifeTime));
        }

        [HttpGet("unitcurrentstatus/{id}")]
        public async Task<ActionResult<ContainerCurrentStatusDto>> UnitCurrentStatus(string id)
        {
            ContainerCurrentStatusDto result = await _containerCurrentStatus.GetContainerCurrentStatus(id);
            if (result == null)
                return NotFound(new ProblemDetails { Title = $"Unit {id} not found." });
            return Ok(result);
        }

        [HttpGet("unitlifetimeimport")]
        public async Task<ActionResult<ContainerImportResultDto>> UnitImportLifeTime(string unitNumber)
        {

            var containerMasterData = await _containerGeneralRequests.GetContainerLifeTimeMasterDataImport(unitNumber);
            if (containerMasterData is null)
                return NotFound(new ProblemDetails { Title = $"No results for  unit {unitNumber}" });

            var result = await _containerImportLifeTimeContext.GetContainerImportResult(containerMasterData);
            if (result == null) return NotFound(new ProblemDetails { Title = "Unit not found" });
            return Ok(result);
        }

        [HttpGet("unitlifetimeexport")]
        public async Task<ActionResult<ContainerExportResultDto>> UnitExportLifeTime(string unitNumber)
        {
            var containerMasterData = await _containerGeneralRequests.GetContainerLifeTimeMasterDataExport(unitNumber);
            if (containerMasterData is null)
            {

                return NotFound(new ProblemDetails { Title = $"No results for  unit {unitNumber}" });
            }
            var result = await _containerExportLifeTimeContext.GetContainerExportResult(containerMasterData);
            if (result == null) return NotFound(new ProblemDetails { Title = "Unit not found" });
            return Ok(result);
        }


    }

}