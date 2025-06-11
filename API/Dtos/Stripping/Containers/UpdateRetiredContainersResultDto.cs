
namespace API.Dtos.Stripping.Containers;

public record UpdateRetiredContainersResult(bool Success,
int UpdatedCount, List<string> FailedContainers);
