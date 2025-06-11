
using API.Dtos.Stripping.Containers;


namespace API.Services.Stripping;


public interface IStripping
{
    Task<List<StrippedContainerDto>> GetStrippedContainersFromInAppDatabase(StrippedContainersDataRequest data);

    Task SaveRetiredContainerInAppDb(RetiredContainersViewDto retiredContainerDto);

    Task ProcessRetiredContainersInDatabase(StrippedContainersDataRequest dataRequest);


    Task<bool> PatchStripContainerInDB(UpdateRetiredContainers dto);


}
