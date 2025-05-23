using API.Dtos.Container.Import;
using API.Dtos.Container;

namespace API.Services.N4ContainerHistory
{    
    public interface IContainerImportLifeTime
    {

        Task<ContainerImportResultDto> GetContainerImportResult(ContainerLifeTimeMasterDataDto containerLifeTimeMasterDataDto);
    }
}