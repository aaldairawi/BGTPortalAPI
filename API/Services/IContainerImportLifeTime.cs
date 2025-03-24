using API.Dtos.CargoContainer;
using API.Dtos.CargoContainer.Import;

namespace API.Services
{
    public interface IContainerImportLifeTime
    {

        Task<ContainerImportResultDto> GetContainerImportResult(ContainerLifeTimeMasterDataDto containerLifeTimeMasterDataDto);

    }
}