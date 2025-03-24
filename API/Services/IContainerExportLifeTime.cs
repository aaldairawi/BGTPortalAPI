using API.Dtos.CargoContainer;
using API.Dtos.CargoContainer.Export;

namespace API.Services
{
    public interface IContainerExportLifeTime
    {
        Task<ContainerExportResultDto>  GetContainerExportResult(ContainerLifeTimeMasterDataDto input);

    }
}