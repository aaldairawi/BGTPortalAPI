
using API.Dtos.Container;

namespace API.Services.N4ContainerHistory
{
    public interface IVesselInformation
    {
        
        Task<VesselTimingDto> GetVesselActualTimeOfArrivalOrCompletion(ContainerLifeTimeMasterDataDto containerLifeTimeMasterDataDto, bool getVesselATA );

        
    }
}