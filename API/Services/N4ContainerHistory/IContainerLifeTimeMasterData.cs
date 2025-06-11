
using API.Dtos.Container;

namespace API.Services.N4ContainerHistory
{
    public interface IContainerLifeTimeMasterData
    {
        Task<ContainerLifeTimeMasterDataDto?> GetContainerLifeTimeMasterData(string containerId, bool getContainerImport);
        

    }
}