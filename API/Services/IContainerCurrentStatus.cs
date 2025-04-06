using API.Dtos.CargoContainer;

namespace API.Services
{
    public interface IContainerCurrentStatus
    {

        Task<ContainerCurrentStatusDto> GetContainerCurrentStatus(string id);

    }
}