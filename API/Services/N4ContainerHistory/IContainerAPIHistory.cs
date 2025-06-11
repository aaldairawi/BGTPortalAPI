using API.Dtos.Container;

namespace API.Services.N4ContainerHistory
{

    public interface IContainerCurrentStatus
    {

        Task<ContainerCurrentStatusDto?> GetContainerCurrentStatusResult(string containerId);

    }
}