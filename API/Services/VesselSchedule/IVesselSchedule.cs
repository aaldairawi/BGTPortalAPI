
using API.Dtos.VesselSchedule;

namespace API.Services.VesselSchedule
{
    public interface IVesselSchedule
    {
        Task<List<WorkingVesselDto>> GetVesselSchedule();

    }
}