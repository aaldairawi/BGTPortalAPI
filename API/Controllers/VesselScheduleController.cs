using API.Dtos.VesselSchedule;
using API.Services.VesselSchedule;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class VesselScheduleController(IVesselSchedule vesselSchedule) : BaseApiController
    {
        private readonly IVesselSchedule _vesselSchedule = vesselSchedule;

        [HttpGet("vessel-schedule")]
        public async Task<ActionResult<List<WorkingVesselDto>>> GetVesselSchedule()
        {
            var result = await _vesselSchedule.GetVesselSchedule();
            return result.Count == 0 ? NoContent() : Ok(result);
        }
    }

}
