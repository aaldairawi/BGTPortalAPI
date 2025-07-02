using API.Dtos.Stripping.Containers;
using API.Dtos.Stripping.Dashboard;

namespace API.Services.Stripping
{
    public interface IStripping
    {
        Task<List<StrippedContainerDto>> GetStrippedContainersFromInAppDatabase(StrippedContainersDataRequest data);
        Task SaveRetiredContainerInAppDb(RetiredContainersViewDto retiredContainerDto);
        Task ProcessRetiredContainersInDatabase(StrippedContainersDataRequest dataRequest);
        Task<bool> PatchStripContainerInDB(UpdateRetiredContainers dto);

        // Existing single-date method (can keep for backward compatibility if needed)
        Task<List<StrippingDashboardDto>> GetDashboardDataAsync(DateTime date);
        Task<List<StrippingDashboardDto>> GetDashboardDataRangeAsync(DateTime fromDate, DateTime toDate);
        Task<List<StrippedContainerDto>> GetCsvData(DateTime fromDate, DateTime toDate,
        CancellationToken ct);

    }
}
