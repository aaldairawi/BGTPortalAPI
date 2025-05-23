using API.Dtos.Container;
using API.Dtos.Container.Export;

namespace API.Services.N4ContainerHistory
{
    public interface IContainerExportLifeTime
    {
        Task<ContainerExportResultDto>  GetContainerExportResult(ContainerLifeTimeMasterDataDto input);

    }
}