using API.Dtos.Container;

namespace API.Services.N4ContainerHistory
{
    /// <summary>
    /// Provides a service to retrieve a containers current status in N4.
    /// </summary>
    public interface IContainerCurrentStatus
    {
        /// <summary>
        /// Gets the containers current status from N4.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>A ContainerCurrentStatusDto object representing the properties for the container.</returns>

        Task<ContainerCurrentStatusDto> GetContainerCurrentStatus(string id);

    }
}