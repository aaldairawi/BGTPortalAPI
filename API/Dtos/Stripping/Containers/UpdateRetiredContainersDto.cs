
namespace API.Dtos.Stripping.Containers;

public record UpdateRetiredContainers(string DriverName, string LaborType,
List<string> Containers, DateTime DateStripped);

